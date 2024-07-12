from django.db import models
from sells_api.models.station import Station


class Pump(models.Model):
    code = models.CharField(max_length=50)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='pumps')

    def __str__(self):
        return self.code
