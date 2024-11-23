from django.contrib.auth import login, authenticate
from rest_framework import viewsets, status, generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from app.serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        # Получаем данные из запроса
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'customer')

        # Проверка на наличие обязательных полей
        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
            user.role = role
            user.save()

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='me', url_name='me', permission_classes=[IsAuthenticated])
    def retrieve_current_user(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    rooms = RoomSerializer(many=True)

class RentViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all()
    serializer_class = RentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




@api_view(['POST'])
def api_register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if username and password:
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "userId": user.id ,
            'role': user.role
        }, status=status.HTTP_201_CREATED)

    return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user:

        refresh = RefreshToken.for_user(user)
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "userId": user.id  ,
            'role': user.role
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class BuildingCreateView(generics.CreateAPIView):
    queryset = Building.objects.all()
    serializer_class = CreateBuildingSerializer


class BuildingUpdateView(generics.UpdateAPIView):
    queryset = Building.objects.all()
    serializer_class = CreateBuildingSerializer


class RoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer


class CreateRentView(generics.CreateAPIView):
    queryset = Rent.objects.all()
    serializer_class = CreateRentSerializer