from django.urls import path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, CustomTokenVerifyView, LogoutView, \
    get_authenticated_user

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='refresh'),
    path('verify/', CustomTokenVerifyView.as_view(), name='verify'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('authenticated-user/', get_authenticated_user, name='authenticated_user'),
]
