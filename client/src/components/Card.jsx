import { use, useEffect, useState } from 'react';
import api from '../service/Service';
import '../styles/card.scss';
import { Modal } from './modal/Modal';
import '../styles/form.scss';

export function Card({ status }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({
    nome: '',
    descricao: '',
    prioridade: '',
    criador: '',
    status: ''
  });

  useEffect(() => {
		async function fetchUsers() {
			try {
				const response = await api.get('usuario/');
				setUsers(response.data);
			} catch (error) {
				console.log('Erro ao buscar usuários:', error);
			}
		}
		fetchUsers();
	}, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('tarefas/');
        console.log("Retorno da API:", response.data); 
        const filteredTasks = response.data.filter(task => task.status === status);
        setTasks(filteredTasks);
      } catch (error) {
        console.log('Erro ao buscar tarefas:', error);
      }
    }
    fetchTasks();
  }, [status]);

  useEffect(() => {
    if (selectedItem) {
      setData({
        nome: selectedItem.nome,
        descricao: selectedItem.descricao,
        prioridade: selectedItem.prioridade,
        criador: selectedItem.criador.id, 
        status: selectedItem.status
      });
    }
  }, [selectedItem]);

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType('');
    setIsModalOpen(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`tarefas/${selectedItem.id}`, data);
      console.log('Tarefa atualizada com sucesso:', response.data);
      closeModal();
    } catch (error) {
      console.log('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`tarefas/${selectedItem.id}`);
      console.log('Tarefa deletada com sucesso:', response.data);
      closeModal();
    } catch (error) {
      console.log('Erro ao deletar tarefa:', error);
    }
  };

  {return (
    <div className='card'>
      {tasks.map((item) => (
        <div key={item.id} className='cardItem'>
          <h4>{item.nome}</h4>
          <p>Descrição: {item.descricao}</p>
          <p>Prioridade: {item.prioridade}</p>
          <p>Criador: {item.criador}</p>
          <p>Status: {item.status}</p>

          <div className='btns'>
            <button className='btn' onClick={() => openModal(item, 'edit')}>
              Editar
            </button>
            <button className='btn' onClick={() => openModal(item, 'delete')}>
              Excluir
            </button>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalType === 'edit' && (
            <form className='modalEdit' onSubmit={handleEdit}>
              <h3>Editar Tarefa</h3>

                <div className='inputGroup'>
                  <label>Nome</label>
                  <input
                    type="text"
                    value={data.nome}
                    onChange={(e) => setData({ ...data, nome: e.target.value })}
                    placeholder="Nome"
                  />
                </div>

                <div className='inputGroup'>
                  <label>Descrição:</label>
                  <textarea
                    value={data.descricao}
                    onChange={(e) => setData({ ...data, descricao: e.target.value })}
                    placeholder="Descrição"
                  />
                </div>

                <div className='inputGroup'>
                  <label>Prioridade</label>
                  <select onChange={(e) => setData({ ...data, prioridade: e.target.value })} value={data.prioridade} name="" id="">
                    <option value="">Selecione a prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className='inputGroup'>
                  <label>Criador</label>
                  <select onChange={(e) => setData({ ...data, criador: e.target.value })} value={data.criador} name="" id="">
                    <option value="">Selecione o criador</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='inputGroup'>
                  <label>Status</label>
                  <select onChange={(e) => setData({ ...data, status: e.target.value })} value={data.status} name="" id="">
                    <option value="">Selecione a prioridade</option>
                    <option value="Fazer">Fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Feito">Feito</option>
                  </select>
                </div>
                
                <div>
                  <button type="submit">Salvar</button>
                </div> 
            </form>
          )}

          {modalType === 'delete' && (
            <div className='modalEdit'>
              <h3>Tem certeza que deseja excluir?</h3>

              <div className='btnsDelete'>
                <button onClick={handleDelete}>Confirmar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )}
}