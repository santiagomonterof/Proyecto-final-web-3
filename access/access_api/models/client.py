from django.db import models
from django.contrib.auth.models import User
from access_api.models.station import Station


class Client(models.Model):
    ROLES = (
        ('1', 'Seller'),
        ('2', 'Station Admin'),
        ('3', 'Refinery Admin'),
        ('4', 'Driver'),
        ('5', 'Access Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=1, choices=ROLES)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

