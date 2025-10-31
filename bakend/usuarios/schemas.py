from ninja import Schema
from typing import Optional
from datetime import datetime


#Registro con email/password

class UserRegisterSchema(Schema):
    email: str
    password: str
    username: str
    firs_name: Optional[str]= None
    last_name: Optional[str]= None
    telefono: Optional[int]= None


class GoogleAuthSchema(Schema):
    id_token: str
    imagen_perfil: Optional[str]= None

class UserOutSchema(Schema):
    id:int
    email: str
    username: str
    first_name: Optional[str]=None
    last_name: Optional[str]=None
    imagen_perfil: Optional[str]= None
    auth_proveedor: str
    correo_verificado: bool
    biografia: Optional[str]= None
    telefono: Optional[int] = None
    creado: datetime
    modificado: datetime

    @staticmethod
    def visualizar_imagen_perfil(obj):
        return obj.get_profile_image()


class UserUpdateSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    imagen_perfil: Optional[str] = None
    biografia: Optional[str] = None
    telefono: Optional[int] = None


class LoginSchema(Schema):
    email: str
    password: str

class TokenSchema(Schema):
    access_token: str
    token_type: str = "breaber"
    user: UserOutSchema