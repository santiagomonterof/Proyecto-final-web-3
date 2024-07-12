from django.db import models
from sells_api.models.pump import Pump
from sells_api.models.fuel import Fuel


class PumpFuel(models.Model):
    pump = models.ForeignKey(Pump, on_delete=models.CASCADE)
    fuel = models.ForeignKey(Fuel, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.DecimalField(max_digits=10, decimal_places=2, default=0)

