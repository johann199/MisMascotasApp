from ninja import Schema
from typing import Optional
from datetime import date

class MascotaCreateSchema(Schema):
    """Schema para crear mascota (solo para documentación)"""
    nombre: str
    raza: str
    dia: date  # Formato: YYYY-MM-DD
    tipo_reporte: str
    descripcion: Optional[str] = None

class MascotaOutSchema(Schema):
    """Schema de respuesta de mascota"""
    id: int
    nombre: str
    raza: str
    dia: Optional[date] = None
    propietario_id: int
    tipo_reporte: str
    descripcion: Optional[str] = None
    imagen: Optional[str] = None

class MascotaListSchema(Schema):
    """Schema para listar mascotas"""
    mascotas: list[MascotaOutSchema]

class MascotaUpdateSchema(Schema):
    """Schema para actualizar mascota (solo para documentación)"""
    nombre: Optional[str] = None
    raza: Optional[str] = None
    dia: Optional[date] = None
    descripcion: Optional[str] = None
    tipo_reporte: Optional[str] = None