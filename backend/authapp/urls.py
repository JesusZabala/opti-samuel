from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, OptometristaListView, EmpleadoViewSet, TokenRefreshView, UsersListView

router = DefaultRouter()
router.register(r'gestion-empleados', EmpleadoViewSet, basename='empleados')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('optometristas/', OptometristaListView.as_view(), name='optometristas-list'),
    path('users/', UsersListView.as_view(), name='users-list'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

