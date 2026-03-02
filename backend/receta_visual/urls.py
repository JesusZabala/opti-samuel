from rest_framework import routers
from .views import RecetaVisualViewSet

# Investigar como registrar peticiones GET, POST, PUT, DELETE por individual

router = routers.DefaultRouter()
router.register('', RecetaVisualViewSet)

urlpatterns = router.urls
