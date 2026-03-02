from rest_framework import routers
from .views import AuditoriaViewSet
router = routers.DefaultRouter()
router.register('', AuditoriaViewSet)

urlpatterns = router.urls