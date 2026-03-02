from rest_framework import routers
from .views import CitaViewSet


router = routers.DefaultRouter()
router.register('', CitaViewSet)

urlpatterns = router.urls