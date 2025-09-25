import { useEffect, useState } from 'react';
import api from '../service/Service';
import '../styles/card.scss';
import { Modal } from './Modal';
import '../styles/form.scss';
import { useDraggable } from '@dnd-kit/core';

function TaskItem({ item, status, onOpenModal }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(item.id),
    data: { column: status },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className="cardItem">
      {/* Área arrastável */}
      <div className="dragArea" {...attributes} {...listeners}>
        <h4>{item.nome}</h4>
        <p>Descrição: {item.descricao}</p>
        <p>Prioridade: {item.prioridade}</p>
        <p>Criador: {item.criador.username ?? item.criador}</p>
        <p>Status: {item.status}</p>
      </div>

      {/* Botões fora do drag */}
      <div className="btns">
        <button
          className="btn"
          type="button"
          onClick={() => onOpenModal(item, 'edit')}
        >
          Editar
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onOpenModal(item, 'delete')}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export function Card({ status }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({
    nome: '',
    descricao: '',
    prioridade: '',
    criador: '',
    status: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('');

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

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('tarefas/');
        const filteredTasks = response.data.filter((task) => task.status === status);
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
        status: selectedItem.status,
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
      await api.patch(`tarefas/${selectedItem.id}`, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === selectedItem.id ? { ...t, ...data } : t))
      );
      closeModal();
    } catch (error) {
      console.log('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`tarefas/${selectedItem.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== selectedItem.id));
      closeModal();
    } catch (error) {
      console.log('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <div className="card">
      {tasks.map((item) => (
        <TaskItem key={item.id} item={item} status={status} onOpenModal={openModal} />
      ))}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalType === 'edit' && (
            <form className="modalEdit" onSubmit={handleEdit}>
              <h3>Editar Tarefa</h3>

              <div className="inputGroup">
                <label>Nome</label>
                <input
                  type="text"
                  value={data.nome}
                  onChange={(e) => setData({ ...data, nome: e.target.value })}
                  placeholder="Nome"
                />
              </div>

              <div className="inputGroup">
                <label>Descrição:</label>
                <textarea
                  value={data.descricao}
                  onChange={(e) => setData({ ...data, descricao: e.target.value })}
                  placeholder="Descrição"
                />
              </div>

              <div className="inputGroup">
                <label>Prioridade</label>
                <select
                  onChange={(e) => setData({ ...data, prioridade: e.target.value })}
                  value={data.prioridade}
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>

              <div className="inputGroup">
                <label>Criador</label>
                <select
                  onChange={(e) => setData({ ...data, criador: e.target.value })}
                  value={data.criador}
                >
                  <option value="">Selecione o criador</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inputGroup">
                <label>Status</label>
                <select
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  value={data.status}
                >
                  <option value="">Selecione o status</option>
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
            <div className="modalEdit">
              <h3>Tem certeza que deseja excluir?</h3>
              <div className="btnsDelete">
                <button onClick={handleDelete}>Confirmar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
