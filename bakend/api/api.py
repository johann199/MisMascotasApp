import os.path

import firebase_admin
from ninja import NinjaAPI
from firebase_admin import credentials, firestore

json_path ="jsonApi/mimascotasapp-firebase-adminsdk-fbsvc-9278304e5b.json"

if not os.path.exists(json_path):
    raise FileNotFoundError(f"Not exit file: {json_path}")
print(f"file is hire: {os.path.abspath(json_path)}")

cred = credentials.Certificate("jsonApi/mimascotasapp-firebase-adminsdk-fbsvc-9278304e5b.json")
firebase_admin.initialize_app(cred)
api = NinjaAPI()

@api.get("/test")
def test(request):
    try:
        db = firestore.client()
        print(f"client created sucefull {db}")
        colletions = db.collections()

        print(f"Conection in Fiestore sucefull")
        return {'message': 'Firebase Conected successfully', 'status': 'ok'}
    except Exception as e:
        print(f'Error connet to Firestore: {str(e)}')
        return {'message': 'Firestore Connection Error', 'error': str(e)}