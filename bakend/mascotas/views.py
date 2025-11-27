from ninja import Router, File, Form
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from .schemas import *
from .models import Mascota
from ninja.errors import HttpError
from django.db import IntegrityError, transaction
from datetime import datetime

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


