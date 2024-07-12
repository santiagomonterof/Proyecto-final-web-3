from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from access_api.models.client import Client


class TokenSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        try:
            client = Client.objects.get(user=user)
            data['role'] = client.role
        except Client.DoesNotExist:
            data['role'] = None

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar rol al token
        try:
            client = Client.objects.get(user=user)
            token['role'] = client.role
        except Client.DoesNotExist:
            token['role'] = None

        return token
