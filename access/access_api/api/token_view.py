from rest_framework_simplejwt.views import TokenObtainPairView
from access_api.api.token_serializers import TokenSerializer


class TokenView(TokenObtainPairView):
    serializer_class = TokenSerializer
