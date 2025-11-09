import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from django.conf import settings


def initialize_firebase():
    if not firebase_admin._apps:
        json_path= os.path.join( settings.BASE_DIR, "jsonApi/mimascotasapp-firebase-adminsdk-fbsvc-9278304e5b.json")

    if not os.path.exists(json_path):
        raise FileNotFoundError(f"No existe el archivo: {json_path}")

    print(f"Inicializando Firebase desde: {os.path.abspath(json_path)}")

    cred = credentials.Certificate(json_path)
    firebase_admin.initialize_app(cred)
    print("Firebase inicializado correctamente")

    return firebase_admin.get_app()


def get_firestore_client():
    initialize_firebase()
    return firestore.client()


def verify_firebase_token(id_token):
    try:
        initialize_firebase()
        decoded_token = auth.verify_id_token(id_token)
        print(f"Token verificado para usuario: {decoded_token.get('email')}")
        return decoded_token
    except auth.InvalidIdTokenError:
        print("Token inválido o expirado")
        return None
    except auth.ExpiredIdTokenError:
        print("Token expirado")
        return None
    except Exception as e:
        print(f"Error verificando token: {str(e)}")
        return None


def get_user_from_firebase(uid):

    try:
        initialize_firebase()
        user = auth.get_user(uid)
        return user
    except Exception as e:
        print(f"Error obteniendo usuario de Firebase: {str(e)}")
        return None