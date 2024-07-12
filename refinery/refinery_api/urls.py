from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TruckViewSet, FuelTypeViewSet, RouteViewSet, FuelStationViewSet, RouteStationViewSet

router = DefaultRouter()
router.register(r'trucks', TruckViewSet)
router.register(r'fueltypes', FuelTypeViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'fuelstations', FuelStationViewSet)
router.register(r'routestations', RouteStationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
