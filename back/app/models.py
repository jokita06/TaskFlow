from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=60)
    email = models.EmailField(unique=True, max_length=255)

    def __str__(self):
        return self.username

prioridade_choices = [
    ('Baixa', 'Baixa'),
    ('Média', 'Média'), 
    ('Alta', 'Alta'),
]

status_choices = [
    ('Fazer', 'Fazer'),
    ('Fazendo', 'Fazendo'), 
    ('Feito', 'Feito'),
]

class Tarefa(models.Model):
    nome = models.CharField(max_length=60)
    descricao = models.TextField(max_length=255)
    setor = models.CharField(max_length=30)
    criador = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    prioridade = models.CharField(max_length=10, choices=prioridade_choices)
    status = models.CharField(max_length=10, choices=status_choices, default='Fazer')
    
    def __str__(self):
        return self.nome