from ninja import Router
from django.contrib.auth import get_user_model, login, authenticate
from django.contrib.auth.hashers import make_password
from firebase_admin import auth as firebase_auth
import firebase_admin
from  .schemas import *


User = get_user_model()
router = Router()


@router.post("/registrar", response=UserOutSchema, tags=["Auth"])
def register_user(request, data: UserRegisterSchema):
    if User.objects.filter(email=data.email).exists():
        return 400, {"detail": "Este Email ya se encuentra registrado"}

    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Este usuario ya se encuentra registrado"}

    user = User.objects.create(
        email= data.email,
        username = data.username,
        password = make_password(data.password),
        first_name = data.firs_name or '',
        last_name = data.last_name or '',
        telefono = data.telefono,
        auth_proveedor = 'email'
    )

    return user

@router.post("/google-auth", response=TokenSchema, tags=["Auth"])
def google_authentication(request, data: GoogleAuthSchema):
    try:
        decode_token = firebase_auth.verify_id_token(data.id_token)
        firebase_uid = decode_token['uid']
        email = decode_token.get('email')
        correo_verificado = decode_token.get('correo_verificado', False)
        name = decode_token.get('name', '')
        picture = decode_token.get('picture', data.imagen_perfil)

        if not email:
            return 400, {"detail": "No se encontro el email de Google"}

        user, created = User.objects.create(
            firebase_uid = firebase_uid,
            defaults = {
                'email': email,
                'username': email.split('@')[0],
                'auth_proveedor': 'google',
                'correo_verificado': correo_verificado,
                'imagen_perfil': picture,
                'first_name': name.split()[0] if name else '',
                'last_name': ''.join(name.split()[1:]) if len(name.split()) > 1 else '',
            }
        )
        if not created and picture and user.imagen_perfil != picture:
            user.imagen_perfil = picture
            user.save(update_fields=['imagen_perfil'])
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        return {
            "access_token": data.id_token,
            "token_type": "bearer",
            "user": user
        }

    except Exception as e:
        return 401, {"detail": f"Token inválido: {str(e)}"}



@router.post("/login", response=TokenSchema, tags=["Auth"])
def login(request, data: LoginSchema):
    user = authenticate(request, username= data.email, password=data.password)

    if user is None:
        return 401, {"detail": "Credenciales Invalidas"}

    return {
        "access_token": "token yt",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response=UserOutSchema, tags=["Auth"])
def get_user(request):
    if not request.auth:
        return  401, {"detail": "No autentificado"}
    return request.auth


@router.patch("/editar", response= UserUpdateSchema, tags=["Auth"])
def update_profile(request, data: UserUpdateSchema):
    if not request.auth:
        return 401, {"detail": "No autentificado"}

    user = request.auth

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    user.save()
    return user