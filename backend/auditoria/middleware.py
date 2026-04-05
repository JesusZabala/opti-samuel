import threading
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.deprecation import MiddlewareMixin

_thread_locals = threading.local()

def get_current_user():
    return getattr(_thread_locals, 'user', None)

class AuditoriaMiddleware(MiddlewareMixin):
    def process_request(self, request):
        user = None
        
        if request.user.is_authenticated:
            user = request.user
        else:
            try:
                header = request.headers.get('Authorization')
                if header and header.startswith('Bearer '):
                    auth = JWTAuthentication()
                    validated_token = auth.get_validated_token(header.split(' ')[1])
                    user = auth.get_user(validated_token)
            except Exception:
                user = None

        _thread_locals.user = user

    def process_response(self, request, response):
        if hasattr(_thread_locals, 'user'):
            del _thread_locals.user
        return response