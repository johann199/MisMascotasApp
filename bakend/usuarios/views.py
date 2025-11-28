from ninja import Router
from django.contrib.auth import get_user_model, login, authenticate
from django.contrib.auth.hashers import make_password
from firebase_admin import auth as firebase_auth
import firebase_admin
from  .schemas import *
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()
usuarios = Router()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@usuarios.get("/Consultar", response=listaUsuariosSchema, tags=["Auth"])
def consultarUsuarios(request):
    usuarios_list = User.objects.all()
    return {"usuarios": usuarios_list}

@usuarios.post("/registrar", response={200: UserOutSchema, 400: DetailErrorSchema}, tags=["Auth"], auth=None)
def register_user(request, data: UserRegisterSchema):
    print(" Datos recibidos:", data.dict())

    # Validar email único
    if User.objects.filter(email=data.email).exists():
        return 400, {"detail": "Este email ya está registrado."}

    # Validar username único
    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Este nombre de usuario ya está registrado."}

    # Validar longitud mínima de contraseña
    if len(data.password) < 6:
        return 400, {"detail": "La contraseña debe tener al menos 6 caracteres."}

    # Crear usuario
    user = User.objects.create(
        email=data.email,
        username=data.username,
        password=make_password(data.password),
        first_name=data.first_name or "",
        last_name=data.last_name or "",
        telefono=data.telefono or "",
        auth_proveedor="email"
    )

    return user

@usuarios.post(
    "/google-auth", 
    response={200: TokenSchema, 400: DetailErrorSchema, 401: DetailErrorSchema}, 
    tags=["Auth"]
)
def google_authentication(request, data: GoogleAuthSchema):
    try:
        decode_token = firebase_auth.verify_id_token(data.id_token)
        firebase_uid = decode_token['uid']
        email = decode_token.get('email')
        correo_verificado = decode_token.get('email_verified', False)
        name = decode_token.get('name', '')
        picture = decode_token.get('picture', data.imagen_perfil) 

        if not email:
            return 400, {"detail": "No se encontró el email de Google en el token."}

        user, created = User.objects.get_or_create(
            firebase_uid=firebase_uid,
            defaults={
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
        print(f"Error en Google Auth: {e}")
        return 401, {"detail": f"Token inválido o expirado: {str(e)}"}



@usuarios.post("/login", response={200: TokenSchema, 400: DetailErrorSchema}, tags=["Auth"], auth=None)
def login_user(request, data: LoginSchema):
    email = data.email
    password = data.password

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return 401, {"detail": "Credenciales inválidas"}

    if not user.check_password(password):
        return 401, {"detail": "Credenciales inválidas"}

    refresh = RefreshToken.for_user(user)

    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    }

@usuarios.get("/me", response=UserOutSchema, tags=["Auth"])
def get_user(request):
    if not request.auth:
        return  401, {"detail": "No autentificado"}
    return request.auth


@usuarios.patch("/editar", response= UserOutSchema, tags=["Auth"])
def update_profile(request, data: UserUpdateSchema):
    if not request.auth:
        return 401, {"detail": "No autentificado"}

    user = request.auth

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    user.save()
    return user


@usuarios.post("/logout", tags=["Auth"], auth=None)
def logout_user(request):
    if not request.auth:
        return 401, {"detail": "No autentificado"}

    from django.contrib.auth import logout
    logout(request)
    return {"detail": "Sesión cerrada exitosamente."}

@usuarios.delete("/eliminar", response={200: DeleteResponseSchema, 401: DetailErrorSchema}, tags=["Auth"])
def delete_user(request):
    if not request.auth:
        return 401, {"detail": "No autentificado"}

    user = request.auth
    user.delete()

    return {"detail": "Usuario eliminado exitosamente."}