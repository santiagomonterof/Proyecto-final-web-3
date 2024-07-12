from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from sells_api.models.station import Station


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Obtener el rol del usuario del token JWT desde el objeto de usuario personalizado
        user_role = getattr(request.user, 'role', None)
        print("User role:", user_role)  # Agrega este registro

        # Verificar si el rol es 'Seller' (1) o 'Access Admin' (5)
        if user_role not in ['1', '5']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = request.data.get('name')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        station = Station.objects.create(
            name=name,
            latitude=latitude,
            longitude=longitude
        )

        station_serializer = self.get_serializer(station)
        headers = self.get_success_headers(station_serializer.data)
        return Response(station_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['1', '5']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['1', '5']:
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)
