from rest_framework import routers
from .views import ClienteViewSet

router = routers.DefaultRouter()
router.register('',ClienteViewSet)

urlpatterns = router.urls
