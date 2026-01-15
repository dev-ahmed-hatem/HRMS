from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.middleware.csrf import get_token

from datetime import timedelta

from employees.serializers import EmployeeReadSerializer
from users.models import User
from users.serializers import UserSerializer

from rest_framework_simplejwt.serializers import TokenVerifySerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import UntypedToken

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=12),
    'BLACKLIST_AFTER_ROTATION': True,

    # custom
    "AUTH_COOKIE": "access_token",
    "REFRESH_COOKIE": "refresh_token",
    "AUTH_COOKIE_DOMAIN": None,
    "AUTH_COOKIE_SECURE": True,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_PATH": "/",
    "AUTH_COOKIE_SAMESITE": "None",
}


def set_response_cookies(access_token, refresh_token, request, response):
    access_token_lifetime = SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
    refresh_token_lifetime = SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

    response.set_cookie(
        key=SIMPLE_JWT["AUTH_COOKIE"],
        value=access_token,
        domain=SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
        path=SIMPLE_JWT["AUTH_COOKIE_PATH"],
        max_age=int(access_token_lifetime.total_seconds()),
        secure=SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
    )

    response.set_cookie(
        key=SIMPLE_JWT["REFRESH_COOKIE"],
        value=refresh_token,
        domain=SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
        path=SIMPLE_JWT["AUTH_COOKIE_PATH"],
        max_age=int(refresh_token_lifetime.total_seconds()),
        secure=SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
    )

    get_token(request)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs) -> Response:
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]
        set_response_cookies(access_token, refresh_token, request, response)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.initial_data["username"])

        response.data["user"] = UserSerializer(user, context={"request": request}).data
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            new_refresh_token = str(token)

            # Prepare the response
            response = Response({"access": access_token, "refresh": new_refresh_token})

            set_response_cookies(access_token, new_refresh_token, request, response)

            return response

        except Exception as e:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenVerifySerializer(TokenVerifySerializer):
    def validate(self, attrs):
        token = attrs["token"]

        # Validate token structure & expiry
        validated_data = super().validate(attrs)

        # Decode token
        untyped_token = UntypedToken(token)
        user_id = untyped_token.payload.get("user_id")

        if not user_id:
            raise InvalidToken("Token does not contain user_id")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise InvalidToken("User does not exist")

        if not user.is_active:
            raise InvalidToken("User account is inactive")

        return validated_data

class CustomTokenVerifyView(TokenVerifyView):
    serializer_class = CustomTokenVerifySerializer


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie(
            key=SIMPLE_JWT['AUTH_COOKIE'],
            path=SIMPLE_JWT['AUTH_COOKIE_PATH'],
            domain=SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
            samesite=SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )
        response.delete_cookie(
            key=SIMPLE_JWT['REFRESH_COOKIE'],
            path=SIMPLE_JWT['AUTH_COOKIE_PATH'],
            domain=SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
            samesite=SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )
        response.delete_cookie(
            key="csrftoken",
            path=SIMPLE_JWT['AUTH_COOKIE_PATH'],
            domain=SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
            samesite=SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )
        return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    is_authenticated = request.user.is_authenticated
    if is_authenticated:
        user_serialized = UserSerializer(request.user, context={"request": request}).data
        employee = None
        if hasattr(request.user, "employee"):
            employee = EmployeeReadSerializer(request.user.employee, context={"request": request}).data

        return Response({"user": user_serialized, "employee": employee}, status=status.HTTP_200_OK)
