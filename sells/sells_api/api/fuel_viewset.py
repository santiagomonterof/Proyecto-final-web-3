from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from sells_api.models.fuel import Fuel


class FuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fuel
        fields = ['id', 'type']


class FuelViewSet(viewsets.ModelViewSet):
    queryset = Fuel.objects.all()
    serializer_class = FuelSerializer
    permission_classes = [IsAuthenticated]

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
