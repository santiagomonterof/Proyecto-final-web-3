from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.utils.deprecation import MiddlewareMixin


class JWTTokenValidationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        jwt_authenticator = JWTAuthentication()
        header = jwt_authenticator.get_header(request)
        print("Authorization header:", header)  # Agrega este registro
        if header is None:
            return

        raw_token = jwt_authenticator.get_raw_token(header)
        print("Raw token:", raw_token)  # Agrega este registro
        if raw_token is None:
            return

        try:
            validated_token = jwt_authenticator.get_validated_token(raw_token)
            print("Validated token:", validated_token)  # Agrega este registro
            request.user_role = validated_token.get('role')
        except (InvalidToken, AuthenticationFailed) as e:
            print("Token validation error:", str(e))  # Agrega este registro
            request.user_role = None
