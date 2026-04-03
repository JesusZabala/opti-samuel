from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import LoginView, OptometristaListView, EmpleadoViewSet

router = DefaultRouter()
router.register(r'gestion-empleados', EmpleadoViewSet, basename='empleados')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('optometristas/', OptometristaListView.as_view(), name='optometristas-list'),
]

