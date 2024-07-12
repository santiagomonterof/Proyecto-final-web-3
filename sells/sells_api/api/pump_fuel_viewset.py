from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from sells_api.models import Fuel, Pump, Station
from sells_api.models.pump_fuel import PumpFuel
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny


class StationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']


class FuelDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fuel
        fields = ['id', 'type']


class PumpFuelDetailSerializer(serializers.ModelSerializer):
    fuel = FuelDetailSerializer()

    class Meta:
        model = PumpFuel
        fields = ['fuel', 'price', 'stock']


class PumpWithFuelsSerializer(serializers.ModelSerializer):
    fuels = serializers.SerializerMethodField()

    class Meta:
        model = Pump
        fields = ['id', 'code', 'station', 'fuels']

    def get_fuels(self, obj):
        pump_fuels = PumpFuel.objects.filter(pump=obj)
        return PumpFuelDetailSerializer(pump_fuels, many=True).data


class PumpWithFuelsAndStationSerializer(serializers.ModelSerializer):
    fuels = serializers.SerializerMethodField()
    station = StationDetailSerializer()

    class Meta:
        model = Pump
        fields = ['id', 'code', 'station', 'fuels']

    def get_fuels(self, obj):
        pump_fuels = PumpFuel.objects.filter(pump=obj)
        return PumpFuelDetailSerializer(pump_fuels, many=True).data


class PumpFuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpFuel
        fields = ['id', 'pump', 'fuel', 'price', 'stock']


class PumpFuelViewSet(viewsets.ModelViewSet):
    queryset = PumpFuel.objects.all()
    serializer_class = PumpFuelSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['1', '2']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['1', '2']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['1', '2']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='get_pumps__with_types_fuel_by_station')
    def get_pumps__with_types_fuel_by_station(self, request):
        station_id = request.query_params.get('station_id')
        if not station_id:
            return Response({'detail': 'Station ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        pumps = Pump.objects.filter(station_id=station_id)
        if not pumps.exists():
            return Response({'detail': 'No pumps found for the given station.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PumpWithFuelsSerializer(pumps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='edit_pumpfuel_by_pump_fuel_ids')
    def edit_pumpfuel_by_pump_fuel_ids(self, request):
        pump_id = request.data.get('pump')
        fuel_id = request.data.get('fuel')
        stock = request.data.get('stock')
        price = request.data.get('price')

        # Validate that all required fields are present
        if pump_id is None:
            return Response({'detail': 'pump_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if fuel_id is None:
            return Response({'detail': 'fuel_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if stock is None:
            return Response({'detail': 'stock is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if price is None:
            return Response({'detail': 'price is required.'}, status=status.HTTP_400_BAD_REQUEST)

        pump_fuel = PumpFuel.objects.filter(pump_id=pump_id, fuel_id=fuel_id).first()

        if not pump_fuel:
            return Response({'detail': 'PumpFuel not found.'}, status=status.HTTP_404_NOT_FOUND)

        # update only the stock and price
        pump_fuel.stock = stock
        pump_fuel.price = price
        pump_fuel.save()

        return Response({'detail': 'PumpFuel updated successfully.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get_all_stations')
    def get_all_stations(self, request):
        stations = Station.objects.all()
        if not stations.exists():
            return Response({'detail': 'No stations found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StationDetailSerializer(stations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='fuel_station')
    def fuel_station(self, request):
        pumps = Pump.objects.all()
        if not pumps.exists():
            return Response({'detail': 'No pumps found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PumpWithFuelsAndStationSerializer(pumps, many=True)
        return Response(serializer.data)
