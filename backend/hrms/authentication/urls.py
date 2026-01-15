from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CustomTokenVerifyView, LogoutView, get_authenticated_user

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('verify/', CustomTokenVerifyView.as_view(), name='verify'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('authenticated-user/', get_authenticated_user, name='authenticated_user'),
]
