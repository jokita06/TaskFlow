# 🗂️ TaskFlow

TaskFlow é um projeto acadêmico de gerenciamento de tarefas no estilo **Kanban**.  
Durante o desenvolvimento, trabalhei em aspectos fundamentais como a **validação de formulários** e a **implementação de recursos de acessibilidade**, garantindo uma experiência de uso inclusiva e eficiente.  

Também aprendi a **testar meu código** para garantir a **qualidade** e o bom funcionamento da aplicação.


## Tela Principal

![Tela Principal do TaskFlow](./client/src/assets/TaskFlow.png)


## Tecnologias Utilizadas

<div style="display: flex; gap: 10px; align-items: center;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" title="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" width="40" title="SCSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" width="40" title="Django"/>
</div>


## Funcionalidades Principais
- Organização de tarefas em colunas no estilo **Kanban**
- **Validação de formulários** para garantir a integridade dos dados
- **Acessibilidade aprimorada** com uso de tags semânticas e atributos ARIA
- Interface intuitiva


## ⚙️ Como Executar o Projeto

```bash
# Clone o repositório
git clone https://github.com/jokita06/TaskFlow.git

# Acesse a pasta do projeto
cd taskflow

# Instale as dependências do frontend
cd client
npm install

## Inicie o servidor React
npm run dev

# Em outro terminal, acesse o backend
cd server

## Crie um ambiente virtual 
python -m venv env

## Baixe as depêndencias
pip install -r requirements.txt

# Inicie o servidor Django
python manage.py runserver
