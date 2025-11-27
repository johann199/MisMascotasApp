import os.path

import firebase_admin
from ninja import NinjaAPI
from usuarios.utils import  initialize_firebase, get_firestore_client
from usuarios.views import usuarios
from mascotas.views import mascotas
from servicios.views import servicios
from usuarios.auth import JWTAuth


initialize_firebase()


api = NinjaAPI(
    title="Mi Mascotas App API",
    version="1.0.0",
    description="API para gestión de mascotas con autenticación Firebase/Google",
    docs_url="/docs",
    #auth=JWTAuth(),
)

api.add_router("/auth", usuarios, auth=None, tags=["Autenticación"])
api.add_router("/mascotas", mascotas, auth=JWTAuth(), tags=["Mascotas"])
api.add_router("/servicios", servicios, auth=JWTAuth(), tags=["Servicios"])

@api.get("/health", tags=["Health"])
def health_check(request):
    """
    Endpoint simple para verificar que la API está funcionando
    """
    return {
        'status': 'ok',
        'message': 'API funcionando correctamente',
        'version': '1.0.0'
    }


@api.get("/", tags=["Root"])
def root(request):
    """
    Endpoint raíz - información de la API
    """
    return {
        'name': 'Mi Mascotas App API',
        'version': '1.0.0',
        'docs': '/api/docs',
        'endpoints': {
            'auth': '/api/auth',
            'mascotas': '/api/mascotas',
            'health': '/api/health',
            'test': '/api/test'
        }
    }