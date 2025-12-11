from ninja import Router, File, Form
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from .schemas import *
from .models import Mascota
from ninja.errors import HttpError
from django.db import IntegrityError, transaction
from datetime import datetime
from .embeddings import *
import traceback

mascotas = Router()

@mascotas.get("/lista", response=MascotaListSchema, tags=["Mascotas"])
def listar_mascotas(request):
    mascotas_list = Mascota.objects.all()
    return {"mascotas": mascotas_list}


from ninja import File
from ninja.files import UploadedFile

@mascotas.post(
    "/crear",
    response=MascotaOutSchema,
    tags=["Mascotas"],
)
def crear_mascota(
    request,
    nombre: str = Form(...),
    raza: str = Form(...),
    dia: str = Form(...),
    tipo_reporte: str = Form(...),
    descripcion: str = Form(""),
    imagen: UploadedFile = File(None),
):
    if not request.user.is_authenticated:
        raise HttpError(401, "Debes estar autenticado para crear una mascota")

    try:
        dia_limpia = dia.strip()
        dia_convertido = datetime.strptime(dia_limpia, "%Y-%m-%d").date()
    except ValueError:
        raise HttpError(400, f"Fecha inválida: {dia}")

    mascota = Mascota.objects.create(
        nombre=nombre,
        raza=raza,
        dia=dia_convertido,
        tipo_reporte=tipo_reporte,
        descripcion=descripcion,
        propietario=request.user,
        imagen=imagen,
    )

    return mascota




@mascotas.post("/actualizar/{mascota_id}", response=MascotaUpdateSchema, tags=["Mascotas"])
def actualizar_mascota(request, mascota_id: int, data: MascotaUpdateSchema, imagen: UploadedFile = File(None)):
    mascota = get_object_or_404(Mascota, id=mascota_id)
    if mascota.propietario != request.user:
        return {"detail": "No tienes permiso para actualizar esta mascota."}
    mascota.nombre = data.nombre
    mascota.raza = data.raza
    mascota.dia = data.dia
    mascota.descripcion = data.descripcion
    mascota.tipo_reporte = data.tipo_reporte
    if data.imagen is not None:
        if mascota.imagen:
            mascota.imagen.delete(save=False)
        mascota.imagen = imagen
    mascota.save()
    return mascota

@mascotas.delete("/eliminar/{mascota_id}", tags=["Mascotas"])
def eliminar_mascota(request, mascota_id: int):
    mascota = get_object_or_404(Mascota, id=mascota_id)
    if mascota.propietario != request.user:
        return {"detail": "No tienes permiso para eliminar esta mascota."}
    if mascota.imagen:
        mascota.imagen.delete(save=False)
    mascota.delete()
    return {"detail": f"Mascota con ID {mascota_id} eliminada exitosamente"}


@mascotas.get("/match/{mascota_id}", tags=["Mascotas"])
def match_mascota(request, mascota_id: int):
    print("=" * 50)
    print(f"Buscando matches para mascota ID: {mascota_id}")
    
    try:
        mascota = get_object_or_404(Mascota, id=mascota_id)
        print(f" Mascota encontrada: {mascota.nombre}")
        print(f"Tipo reporte: {mascota.tipo_reporte}")
        print(f"Tiene imagen: {bool(mascota.imagen)}")

        # Validar que tenga imagen (sin importar el tipo)
        if not mascota.imagen:
            print("Error: La mascota no tiene imagen")
            raise HttpError(400, "La mascota no tiene imagen registrada")

        # Verificar que el archivo existe
        import os
        imagen_path = mascota.imagen.path
        print(f"Ruta de imagen: {imagen_path}")
        
        if not os.path.exists(imagen_path):
            print(f"Error: Archivo no existe en {imagen_path}")
            raise HttpError(400, "El archivo de imagen no existe en el servidor")
        
        print("Generando embedding de mascota base...")
        mascota_emb = generate_embedding(imagen_path)
        print(f"Embedding generado. Shape: {mascota_emb.shape}")

        # Determinar qué tipo de mascotas buscar (el opuesto)
        if mascota.tipo_reporte == "Pérdida":
            tipo_buscar = "Encontrada"
            mensaje = "Buscando mascotas ENCONTRADAS que coincidan con la perdida..."
        else:  # Es "Encontrada"
            tipo_buscar = "Pérdida"
            mensaje = "Buscando mascotas PERDIDAS que coincidan con la encontrada..."
        
        print(mensaje)

        resultados = []
        otras_mascotas = Mascota.objects.filter(tipo_reporte=tipo_buscar).exclude(id=mascota_id)
        print(f"Total de mascotas '{tipo_buscar}' a comparar: {otras_mascotas.count()}")

        for otra in otras_mascotas:
            if not otra.imagen:
                print(f"Mascota {otra.nombre} (ID: {otra.id}) no tiene imagen, omitiendo...")
                continue

            otra_path = otra.imagen.path
            print(f"Procesando: {otra.nombre} (ID: {otra.id}) - {otra_path}")
            
            if not os.path.exists(otra_path):
                print(f"Archivo no existe: {otra_path}")
                continue

            try:
                otra_emb = generate_embedding(otra_path)
                similarity = float(cosine_similarity(mascota_emb, otra_emb))
                print(f"  └─ Similitud: {similarity:.3f}")

                if similarity >= 0.50:  # Umbral de similitud
                    print(f"MATCH! Agregando a resultados")
                    resultados.append({
                        "id": otra.id,
                        "nombre": otra.nombre,
                        "raza": otra.raza,
                        "descripcion": otra.descripcion,
                        "imagen": otra.imagen.url,
                        "tipo_reporte": otra.tipo_reporte,
                        "similitud": round(similarity, 3)
                    })
                else:
                    print(f"Similitud muy baja ({similarity:.3f} < 0.65)")
                    
            except Exception as e:
                print(f"Error procesando {otra.nombre}: {str(e)}")
                import traceback
                print(traceback.format_exc())
                continue

        # Ordenar por similitud (mayor a menor)
        resultados = sorted(resultados, key=lambda x: -x["similitud"])
        print(f"\n{'='*50}")
        print(f"Total de matches encontrados: {len(resultados)}")
        if resultados:
            print("Top 3 matches:")
            for i, r in enumerate(resultados[:3], 1):
                print(f"  {i}. {r['nombre']} - Similitud: {r['similitud']}")
        print("=" * 50)

        return {
            "mascota_base": {
                "id": mascota.id,
                "nombre": mascota.nombre,
                "tipo_reporte": mascota.tipo_reporte
            },
            "total_matches": len(resultados),
            "matches": resultados
        }
    
    except HttpError:
        raise
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HttpError(500, f"Error procesando matches: {str(e)}")