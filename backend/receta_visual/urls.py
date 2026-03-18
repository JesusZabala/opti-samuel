from rest_framework import routers
from .views import RecetaVisualViewSet
from django.urls import path, include
# Investigar como registrar peticiones GET, POST, PUT, DELETE por individual

router = routers.DefaultRouter()
router.register(r'', RecetaVisualViewSet, basename='recetas')

urlpatterns = [
    path('', include(router.urls)),
]