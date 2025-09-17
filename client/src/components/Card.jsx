import { useEffect, useState } from 'react';
import api from '../service/Service';
import '../styles/card.scss'

export function Card({ status }) {
  const [tasks, setTasks] = useState([]);

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

  async function editTask(id) {


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
            <button className='btn'>Editar</button>
            <button className='btn'>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}