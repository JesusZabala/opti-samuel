from rest_framework import routers
from .views import PedidoViewSet
from django.urls import path, include
router = routers.DefaultRouter()
router.register(r'', PedidoViewSet, basename='cita')

urlpatterns = [
    path('', include(router.urls)),
]
