from django.db import models
from django.contrib.auth.models import  AbstractUser


class User (AbstractUser):
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    edad = models.BigIntegerField(null=True, blank=True)
    password = models.CharField("Contraseña", max_length=128)
    correo_verificado = models.BooleanField("¿Correo Verificado?", default=False)
    imagen_perfil = models.URLField("imagen de perfil", max_length=500, blank=True, null=True, help_text='Url del perfil')
    biografia = models.TextField("Biografia", max_length=300, blank=True, null= True)
    telefono = models.BigIntegerField("Teléfono", null=True, blank=True)
    firebase_uid = models.CharField('Firebase UID',max_length=128, unique=True,blank=True,null=True, help_text='UID único de Firebase para usuarios de Google')
    auth_proveedor = models.CharField("Proveedor de autentificaión", max_length=20, choices=[('email', 'Email/Password'), ('google', 'Google'),], default='email')


    class Meta:
        ordering = ['-creado']
    def __str__(self):
        return self.email

    def get_full_name(self):
        full_name = f' {self.first_name} - {self.last_name}'.strip()
        return full_name or self.email

    def get_profile_image(self):
        if self.imagen_perfil:
            return self.imagen_perfil
        return f'https://ui-avatars.com/api/?name={self.get_full_name()}&size=200'

    def is_google_user(self):
        return self.auth_proveedor == 'google' and bool(self.firebase_uid)


    def save(self, *args, **kwargs):
        if self.auth_proveedor == 'google' and self.firebase_uid:
            self.correo_verificado = True
        super().save(*args, **kwargs)



