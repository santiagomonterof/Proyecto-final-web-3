from rest_framework import authentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class CustomAuthUser:
    def __init__(self, user_id=None, role=None):
        self.pk = user_id
        self.role = role
        self.is_authenticated = False


class CustomJWTAuth(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_auth = JWTAuthentication()
        header = request.headers.get('Authorization')
        if not header:
            return None

        try:
            bearer_token = header.split()
            if len(bearer_token) != 2 or bearer_token[0].lower() != 'bearer':
                return None

            raw_token = bearer_token[1]
            validated_token = jwt_auth.get_validated_token(raw_token)
            user_id = validated_token["user_id"]
            user_role = validated_token.get("role")

            if user_role is None:
                raise AuthenticationFailed('No role found in token')

            custom_user = CustomAuthUser(user_id=user_id, role=user_role)
            custom_user.is_authenticated = True

            return (custom_user, None)
        except (InvalidToken, AuthenticationFailed) as e:
            print("Token validation error:", str(e))
            return None
