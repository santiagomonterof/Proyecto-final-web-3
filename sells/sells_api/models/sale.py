from django.db import models
from sells_api.models.pump import Pump
from sells_api.models.fuel import Fuel


class Sale(models.Model):
    invoice_name = models.CharField(max_length=100)
    invoice_nit = models.CharField(max_length=20)
    client = models.CharField(max_length=100)
    email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_liters = models.DecimalField(max_digits=10, decimal_places=2)
    product_type = models.ForeignKey(Fuel, on_delete=models.CASCADE)
    pump = models.ForeignKey(Pump, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)
    #is_annulled = models.BooleanField(default=False)
