import { useEffect, useState } from 'react';
import api from '../service/Service';
import '../styles/card.scss'

export function Card({ status }) {
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    prioridade: '',
    criador: '',
    status: ''
  })
  const [criador, setCriador] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('tarefas/');
        const filteredTasks = response.data.filter(task => task.status === status);
        setTasks(filteredTasks);
      } catch (error) {
        console.log('Erro ao buscar tarefas:', error);
      }
    }
    fetchTasks();
  }, [status]);

  const handleEdit = (tasksId) => {
    const taskToEdit = tasks.find(task => task.id === tasksId);
    if (taskToEdit) {
      setFormData({
        nome: taskToEdit.nome,
        descricao: taskToEdit.descricao,
        prioridade: taskToEdit.prioridade,
        criador: taskToEdit.criador,
        status: taskToEdit.status
      });
    }
  }

  const handleDelete = async (tasksId) => {
    try {
      await api.delete(`tarefas/${tasksId}/`);
      setTasks(tasks.filter(task => task.id !== tasksId));

      const response = await api.get('tarefas/');
      setTasks(response.data);

    } catch (error) {
      console.log('Erro ao excluir tarefa:', error);
    }
  }

  return (
    <div className='card'>
      {tasks.map((task) => (
        <div key={task.id} className='cardItem'>
          <h4>{task.nome}</h4>
          <p>Descrição: {task.descricao}</p>
          <p>Prioridade: {task.prioridade}</p>
          <p>Criador: {task.criador}</p>
          <p>Status: {task.status}</p>

          <div className='btns'>
            <button className='btn' onClick={() => handleEdit(task.id)}>Editar</button>
            <button className='btn' onClick={() => handleDelete(task.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}