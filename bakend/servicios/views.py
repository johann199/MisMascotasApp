from typing import List
from ninja import Router, File, Form
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from .models import Servicio
from .schemas import* 
from ninja.errors import HttpError

servicios = Router()

# LISTAR
@servicios.get("/lista", response=List[ServicioOutSchema])
def listar_servicios(request):
    servicios = Servicio.objects.all()
    for s in servicios:
        s._request = request
    return servicios

# CREAR
@servicios.post("/crear", response=ServicioSchema)
def crear_servicio(
    request,
    nombre: str = Form(...),
    descripcion: str = Form(""),
    telefono: str = Form(...),
    imagen: UploadedFile = File(None),
):
    if not request.user.is_authenticated:
        raise HttpError(401, "Debes iniciar sesión")

    servicio = Servicio.objects.create(
        nombre=nombre,
        descripcion=descripcion,
        telefono=telefono,
        propietario=request.user,
        imagen=imagen,
    )
    return servicio

# ACTUALIZAR
@servicios.post("/actualizar/{servicio_id}", response=ServicioSchema)
def actualizar_servicio(
    request,
    servicio_id: int,
    data: ServicioUpdateSchema,
    imagen: UploadedFile = File(None),
):
    servicio = get_object_or_404(Servicio, id=servicio_id)

    if servicio.propietario != request.user:
        raise HttpError(403, "No puedes modificar este servicio")

    servicio.nombre = data.nombre
    servicio.descripcion = data.descripcion
    servicio.telefono = data.telefono

    if imagen:
        if servicio.imagen:
            servicio.imagen.delete(save=False)
        servicio.imagen = imagen

    servicio.save()
    return servicio

# ELIMINAR
@servicios.delete("/eliminar/{servicio_id}")
def eliminar_servicio(request, servicio_id: int):
    servicio = get_object_or_404(Servicio, id=servicio_id)

    if servicio.propietario != request.user:
        raise HttpError(403, "No puedes eliminar este servicio")

    if servicio.imagen:
        servicio.imagen.delete(save=False)

    servicio.delete()
    return {"detail": "Servicio eliminado correctamente"}
