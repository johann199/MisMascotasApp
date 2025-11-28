from ninja import Schema
from datetime import datetime
from typing import Optional

class ServicioSchema(Schema):
    id: int
    nombre: str
    descripcion: str
    telefono: str
    imagen: Optional[str]

    

class ServicioCreateSchema(Schema):
    nombre: str
    descripcion: str
    telefono: str

class ServicioUpdateSchema(Schema):
    nombre: str
    descripcion: str
    telefono: str

class ServicioOutSchema(Schema):
    id: int
    nombre: str
    descripcion: str
    telefono: str
    imagen: str | None

    @staticmethod
    def resolve_imagen(servicio):
        request = servicio._request
        if servicio.imagen:
            return request.build_absolute_uri(servicio.imagen.url)
        return None