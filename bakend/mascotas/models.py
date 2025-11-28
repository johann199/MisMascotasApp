from django.db import models
from usuarios.models import User
from django.utils import timezone

tipo_reporte = (("Pérdida", "Pérdida"), ("Encontrada", "Encontrada"))
class Mascota(models.Model):
    nombre = models.CharField(max_length=100)
    raza = models.CharField(max_length=50)
    dia = models.DateField(blank=True, null=True)
    propietario = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo_reporte = models.CharField(max_length=20, choices=tipo_reporte)
    descripcion = models.TextField(null=True, blank=True)
    imagen = models.ImageField(upload_to='mascotas/', null=True, blank=True)


    def __str__(self):
        return f"{self.nombre} ({self.raza})"