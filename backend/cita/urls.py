from rest_framework import routers
from .views import CitaViewSet
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'', CitaViewSet, basename='cita')

urlpatterns = [
    path('', include(router.urls)),
]