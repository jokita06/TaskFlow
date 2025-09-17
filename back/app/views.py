from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UsuarioSerializer, TarefasSerializer
from .models import Usuario, Tarefa

class UsuarioListCreate(ListCreateAPIView):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class TarefasListCreate(ListCreateAPIView):
    serializer_class = TarefasSerializer
    queryset = Tarefa.objects.all()

class TarefasDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = TarefasSerializer
    queryset = Tarefa.objects.all()
    lookup_field = 'pk'
