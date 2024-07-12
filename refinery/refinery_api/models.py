from django.db import models

from django.db import models


class Truck(models.Model):
    name = models.CharField(max_length=100)
    license_plate = models.CharField(max_length=50)
    assigned_driver = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name


class FuelType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Route(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=100)
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
    fuel_quantity = models.FloatField()
    fuel_type = models.ForeignKey(FuelType, on_delete=models.CASCADE)
    fuel_price_per_liter = models.FloatField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class FuelStation(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    needs_fuel = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class RouteStation(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    station = models.ForeignKey(FuelStation, on_delete=models.CASCADE)
    fuel_to_deliver = models.FloatField()
    delivered = models.BooleanField(default=False)
