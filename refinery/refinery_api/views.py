from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Truck, FuelType, Route, FuelStation, RouteStation
from .serializers import TruckSerializer, FuelTypeSerializer, RouteSerializer, FuelStationSerializer, \
    RouteStationSerializer
from rest_framework.decorators import action


class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def assign_driver(self, request, pk=None):
        truck = self.get_object()
        driver_id = request.data.get('driver_id')
        if not driver_id:
            return Response({'detail': 'Driver ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        truck.assigned_driver = driver_id
        truck.save()
        return Response({'status': 'Driver assigned'})


class FuelTypeViewSet(viewsets.ModelViewSet):
    queryset = FuelType.objects.all()
    serializer_class = FuelTypeSerializer
    permission_classes = [IsAuthenticated]


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Custom logic for route creation if needed
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def stations(self, request, pk=None):
        route = self.get_object()
        route_stations = RouteStation.objects.filter(route=route)
        serializer = RouteStationSerializer(route_stations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def map(self, request, pk=None):
        # Logic to return map with stations, showing which ones are completed
        route = self.get_object()
        route_stations = RouteStation.objects.filter(route=route)
        # Here, implement your logic to generate the map data
        # For simplicity, we'll return the stations with their completed status
        data = {
            "stations": [
                {
                    "name": rs.station.name,
                    "latitude": rs.station.latitude,
                    "longitude": rs.station.longitude,
                    "delivered": rs.delivered
                }
                for rs in route_stations
            ]
        }
        return Response(data)


class FuelStationViewSet(viewsets.ModelViewSet):
    queryset = FuelStation.objects.all()
    serializer_class = FuelStationSerializer
    permission_classes = [IsAuthenticated]


class RouteStationViewSet(viewsets.ModelViewSet):
    queryset = RouteStation.objects.all()
    serializer_class = RouteStationSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        response = super().update(request, *args, **kwargs)
        if instance.delivered:
            # Call external API to update fuel stock in the station
            self.update_fuel_station_stock(instance.station, instance.fuel_to_deliver,
                                           instance.route.fuel_price_per_liter)
        return response

    def update_fuel_station_stock(self, station, quantity, price_per_liter):
        # Logic to update fuel stock in the external system
        pass

    @action(detail=False, methods=['get'])
    def driver_routes(self, request):
        driver_id = request.query_params.get('driver_id')
        routes = Route.objects.filter(truck__assigned_driver=driver_id)
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        route_station = self.get_object()
        route_station.delivered = True
        route_station.save()
        self.update_fuel_station_stock(route_station.station, route_station.fuel_to_deliver,
                                       route_station.route.fuel_price_per_liter)
        return Response({'status': 'Station marked as delivered'})
