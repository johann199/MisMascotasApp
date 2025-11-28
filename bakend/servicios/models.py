from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='servicios/', null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    propietario = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
