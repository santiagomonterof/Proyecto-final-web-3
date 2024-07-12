from django.urls import path, include
from rest_framework.routers import DefaultRouter

from access_api.api.client_viewset import ClientViewSet
from access_api.api.station_viewset import StationViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'stations', StationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('clients/create_station/', ClientViewSet.as_view({'post': 'create_station'}), name='create_station'),
]