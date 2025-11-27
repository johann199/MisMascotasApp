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
        print(f"✅ Mascota encontrada: {mascota.nombre}")
        print(f"Tipo reporte: {mascota.tipo_reporte}")
        print(f"Tiene imagen: {bool(mascota.imagen)}")
        
        if mascota.tipo_reporte != "Pérdida":
            print(f"❌ Error: Mascota es de tipo '{mascota.tipo_reporte}', no 'Pérdida'")
            raise HttpError(400, "Solo se pueden comparar mascotas PERDIDAS")

        if not mascota.imagen:
            print("❌ Error: La mascota no tiene imagen")
            raise HttpError(400, "La mascota no tiene imagen registrada")

        # Ruta completa de la imagen
        imagen_path = mascota.imagen.path
        print(f"Ruta de imagen: {imagen_path}")
        
        # Verificar que el archivo existe
        import os
        if not os.path.exists(imagen_path):
            print(f"❌ Error: Archivo no existe en {imagen_path}")
            raise HttpError(400, "El archivo de imagen no existe en el servidor")
        
        print("Generando embedding de mascota perdida...")
        perdida_emb = generate_embedding(imagen_path)
        print(f"✅ Embedding generado. Shape: {perdida_emb.shape}")

        resultados = []
        encontradas = Mascota.objects.filter(tipo_reporte="Encontrada")
        print(f"Total de mascotas encontradas: {encontradas.count()}")

        for encontrada in encontradas:
            if not encontrada.imagen:
                print(f"⚠️ Mascota {encontrada.nombre} no tiene imagen, omitiendo...")
                continue

            encontrada_path = encontrada.imagen.path
            print(f"Procesando: {encontrada.nombre} - {encontrada_path}")
            
            if not os.path.exists(encontrada_path):
                print(f"⚠️ Archivo no existe: {encontrada_path}")
                continue

            try:
                encontrada_emb = generate_embedding(encontrada_path)
                similarity = float(cosine_similarity(perdida_emb, encontrada_emb))
                print(f"Similitud con {encontrada.nombre}: {similarity:.3f}")

                if similarity >= 0.65:
                    resultados.append({
                        "id": encontrada.id,
                        "nombre": encontrada.nombre,
                        "descripcion": encontrada.descripcion,
                        "imagen": encontrada.imagen.url,
                        "similitud": round(similarity, 3)
                    })
            except Exception as e:
                print(f"❌ Error procesando {encontrada.nombre}: {str(e)}")
                continue

        resultados = sorted(resultados, key=lambda x: -x["similitud"])
        print(f"✅ Matches encontrados: {len(resultados)}")
        print("=" * 50)

        return {"matches": resultados}
    
    except HttpError:
        raise
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        print(traceback.format_exc())
        raise HttpError(500, f"Error procesando matches: {str(e)}")