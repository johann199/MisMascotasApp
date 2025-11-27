from ninja.security import HttpBearer
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuth(HttpBearer):

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")

            user = User.objects.get(id=user_id)

            
            request.user = user

            return user

        except Exception as e:
            print("Error autenticando JWT:", e)
            return None
