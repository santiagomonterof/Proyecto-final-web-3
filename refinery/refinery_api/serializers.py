from rest_framework import serializers
from .models import Truck, FuelType, Route, FuelStation, RouteStation


class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'name', 'license_plate', 'assigned_driver']


class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = ['id', 'name']


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'date', 'name', 'truck', 'fuel_quantity', 'fuel_type', 'fuel_price_per_liter', 'completed']


class FuelStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelStation
        fields = ['id', 'name', 'latitude', 'longitude', 'needs_fuel']


class RouteStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStation
        fields = ['id', 'route', 'station', 'fuel_to_deliver', 'delivered']
