from .views import UsuarioListCreate, TarefasListCreate, TarefasDetail
from django.urls import path

urlpatterns = [
    path('usuario/', UsuarioListCreate.as_view(), name="listar_criar_usuarios"),
    path('tarefas/', TarefasListCreate.as_view(), name="Listar_criar_tarefas"),
    path('tarefas/<int:pk>', TarefasDetail.as_view(), name="Detalhes_tarefas")
]
