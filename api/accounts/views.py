# Django Imports
from django.shortcuts import render
from django.contrib.auth import authenticate

# Django_Rest Imports
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# Local Imports
from .serializers import UserSerializer, SignUpSerializer


def get_auth_for_user(user):
    tokens = RefreshToken.for_user(user)
    # print("token:", type(tokens), tokens)
    serializer = UserSerializer(user)
    return {
        "user": serializer.data,
        "tokens": {
            "access": str(tokens.access_token),
            "refresh": str(tokens),
        },
    }


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        user_data = get_auth_for_user(user)

        return Response(user_data)




class SignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        new_user = SignUpSerializer(data=request.data)
        new_user.is_valid(raise_exception=True)
        user = new_user.save()
        user_data = get_auth_for_user(user)

        return Response(user_data)
