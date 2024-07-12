from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from access_api.models import Client
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from access_api.models.station import Station


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']


class ClientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    password = serializers.CharField(source='user.password', write_only=True, required=False)
    station = StationSerializer()

    class Meta:
        model = Client
        fields = ['id', 'username', 'password', 'role', 'station']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        client = Client.objects.create(user=user, **validated_data)
        return client


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')
        station_id = request.data.get('station')

        if not username or not password:
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        station = Station.objects.get(id=station_id)
        client = Client.objects.create(user=user, role=role, station=station)

        serializer = self.get_serializer(client)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        username = request.data.get('username')
        role = request.data.get('role')
        station_id = request.data.get('station')

        if not username or not role or not station_id:
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        client = self.get_object()
        client.user.username = username
        client.role = role
        client.station = Station.objects.get(id=station_id)
        client.user.save()
        client.save()

        serializer = self.get_serializer(client)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        client = self.get_object()
        client.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username:
            return Response({'username': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'password': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            client = Client.objects.get(user=user)
            refresh = RefreshToken.for_user(user)
            refresh['role'] = client.role
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'client': ClientSerializer(client).data
            })
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
