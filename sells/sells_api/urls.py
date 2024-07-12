from django.urls import path, include
from rest_framework.routers import DefaultRouter

from sells_api.api.station_viewset import StationViewSet
from sells_api.api.pump_viewset import PumpViewSet
from sells_api.api.fuel_viewset import FuelViewSet
from sells_api.api.pump_fuel_viewset import PumpFuelViewSet
from sells_api.api.sale_viewset import SaleViewSet

router = DefaultRouter()
router.register(r'stations', StationViewSet)
router.register(r'pumps', PumpViewSet)
router.register(r'fuels', FuelViewSet)
router.register(r'pump-fuels', PumpFuelViewSet)
router.register(r'sales', SaleViewSet, basename='sale')

urlpatterns = [
    path('', include(router.urls)),
    path('pump-fuels/get_pumps__with_types_fuel_by_station/',
         PumpFuelViewSet.as_view({'get': 'get_pumps__with_types_fuel_by_station'}),
         name='get_pumps__with_types_fuel_by_station'),
    path('pump-fuels/edit_pumpfuel_by_pump_fuel_ids/',
         PumpFuelViewSet.as_view({'post': 'edit_pumpfuel_by_pump_fuel_ids'}), name='edit_pumpfuel_by_pump_fuel_ids'),
    path('pump-fuels/fuel_station/', PumpFuelViewSet.as_view({'get': 'fuel_station'}), name='fuel_station'),
]
