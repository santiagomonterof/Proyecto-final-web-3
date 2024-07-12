from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from sells_api.models import PumpFuel
from sells_api.models.sale import Sale


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ['id', 'invoice_name', 'invoice_nit', 'client', 'email', 'amount', 'product_price', 'quantity_liters',
                  'product_type', 'pump', 'date_time']


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date_time')
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role != '1':  # Solo los vendedores pueden crear ventas
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pump = serializer.validated_data['pump']
        fuel = serializer.validated_data['product_type']
        quantity_liters = serializer.validated_data['quantity_liters']

        try:
            pump_fuel = PumpFuel.objects.get(pump=pump, fuel=fuel)
        except PumpFuel.DoesNotExist:
            return Response({'detail': 'The pump does not have the specified fuel type.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if pump_fuel.stock < quantity_liters:
            return Response({'detail': 'Insufficient fuel stock.'}, status=status.HTTP_400_BAD_REQUEST)

        pump_fuel.stock -= quantity_liters
        pump_fuel.save()

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        user_role = getattr(request.user, 'role', None)
        if user_role != '2':  # Solo los administradores pueden anular ventas
            return Response({'detail': 'Client with unauthorized role.'}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
