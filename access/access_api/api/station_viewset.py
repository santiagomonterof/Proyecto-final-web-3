import requests
from rest_framework import serializers, viewsets, status
from rest_framework.response import Response

from access_api.models.station import Station


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = request.data.get('name')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        # Crear la estación en la base de datos local
        station = Station.objects.create(
            name=name,
            latitude=latitude,
            longitude=longitude
        )

        # Obtener el token de autorización del encabezado de la solicitud original
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)  # Agrega este registro

        # Intentar crear la estación en la otra API
        try:
            response = requests.post('http://127.0.0.1:8001/api/stations/', json={
                'name': name,
                'latitude': latitude,
                'longitude': longitude
            }, headers={'Authorization': auth_header})

            if response.status_code != 201:
                # Si la solicitud a la otra API falla, eliminar la estación local
                station.delete()
                return Response({
                    'detail': 'Failed to create station in the external API.',
                    'error': response.json()  # Aquí se incluye el error devuelto por la otra API
                }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            # Si hay un error en la solicitud, eliminar la estación local
            station.delete()
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        station_serializer = self.get_serializer(station)
        headers = self.get_success_headers(station_serializer.data)
        return Response(station_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = request.data.get('name')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        # Obtener el token de autorización del encabezado de la solicitud original
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)

        # Obtener la estación local
        station = self.get_object()

        # Actualizar la estación en la base de datos local
        station.name = name
        station.latitude = latitude

        station.longitude = longitude
        station.save()

        # Intentar actualizar la estación en la otra API
        try:
            response = requests.put(f'http://127.0.0.1:8001/api/stations/{station.id}/', json={
                'name': name,
                'latitude': latitude,
                'longitude': longitude
            }, headers={'Authorization': auth_header})

            if response.status_code != 200:
                return Response({
                    'detail': 'Failed to update station in the external API.',
                    'error': response.json()
                }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        station_serializer = self.get_serializer(station)
        return Response(station_serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        # Obtener el token de autorización del encabezado de la solicitud original
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)

        # Obtener la estación local
        station = self.get_object()

        # Intentar eliminar la estación en la otra API
        try:
            response = requests.delete(
                f'http://127.0.0.1:8001/api/stations/{station.id}/',
                headers={'Authorization': auth_header}
            )

            if response.status_code != 204:
                return Response({
                    'detail': 'Failed to delete station in the external API.',
                    'error': response.json()
                }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Si la eliminación en la API externa fue exitosa, eliminar la estación localmente
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            return Response({'detail': 'Station deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return response
