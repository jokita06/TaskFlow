from rest_framework import serializers
from .models import Usuario, Tarefa

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class TarefasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = ['id', 'nome', 'descricao', 'setor', 'criador', 'prioridade', 'status']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['criador'] = instance.criador.username if instance.criador else None
        return representation