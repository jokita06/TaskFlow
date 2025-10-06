// Card.jsx
import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Modal } from "./Modal";
import api from "../service/Service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaTask } from "../validations/taskValidation";
import { ErrorMessage } from "../components/ErrorMessage";
import "../styles/Card.scss";
import "../styles/form.scss"

function TaskItem({ item, status, onOpenModal, onUpdateStatus }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: String(item.id),
    data: { column: status },
  });

  return (
    <article ref={setNodeRef} className="cardItem" aria-label={`Tarefa: ${item.nome}`}>
      <div className="dragArea" {...attributes} {...listeners} role="" aria-label="Área de arrastar">
        <h4>{item.nome}</h4>
        <p>Descrição: {item.descricao}</p>
        <p>Setor: {item.setor}</p>
        <p>Prioridade: {item.prioridade}</p>
        <p>Criador: {item.criador?.username ?? item.criador}</p>

        <div role="group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={item.status}
            onChange={(e) => onUpdateStatus(item.id, e.target.value)}
            className="statusSelect"
          >
            <option value="">Selecione o status</option>
            <option value="Fazer">Fazer</option>
            <option value="Fazendo">Fazendo</option>
            <option value="Feito">Feito</option>
          </select>
        </div>
      </div>

      <div className="btns" role="group" aria-label="Botões de editar e excluir tarefa">
        <button className="btn" onClick={() => onOpenModal(item, "edit")}>
          Editar
        </button>
        <button className="btn" onClick={() => onOpenModal(item, "delete")}>
          Excluir
        </button>
      </div>
    </article>
  );
}

export function Card({ tasks, status, setAllTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");
  const [users, setUsers] = useState([]);

  // UseForm para o modal de edição
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(schemaTask)
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("usuario/");
        setUsers(response.data);
      } catch (error) {
        console.log("Erro ao buscar usuários:", error);
      }
    }
    fetchUsers();
  }, []);

  const onOpenModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
    
    if (type === "edit") {
      // Preenche o formulário com os dados atuais
      setValue('nome', item.nome);
      setValue('descricao', item.descricao);
      setValue('setor', item.setor);
      setValue('criador', item.criador?.id ?? item.criador);
      setValue('prioridade', item.prioridade);
      setValue('status', item.status);
    }
  };

  const onCloseModal = () => {
    setSelectedItem(null);
    setModalType("");
    setIsModalOpen(false);
    reset();
  };

  const handleEdit = async (data) => {
    try {
      await api.patch(`tarefas/${selectedItem.id}`, {
        ...data,
        criador: parseInt(data.criador),
      });
      setAllTasks((prev) =>
        prev.map((t) => (t.id === selectedItem.id ? { ...t, ...data } : t))
      );
      onCloseModal();
    } catch (error) {
      console.log("Erro ao atualizar tarefa:", error.response || error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`tarefas/${selectedItem.id}`);
      setAllTasks((prev) => prev.filter((t) => t.id !== selectedItem.id));
      onCloseModal();
    } catch (error) {
      console.log("Erro ao deletar tarefa:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setAllTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      await api.patch(`tarefas/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  return (
    <section className="card" aria-label={`Coluna de tarefas: ${status}`}>
      {tasks.length > 0 ? (
        tasks.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            status={status}
            onOpenModal={onOpenModal}
            onUpdateStatus={updateStatus}
          />
        ))
      ) : (
        <p className="emptyMessage">Nenhuma tarefa registrada</p>
      )}

      {isModalOpen && (
        <Modal onClose={onCloseModal}>
          {modalType === "edit" && (
            <form className="modalEdit" onSubmit={handleSubmit(handleEdit)}>
              <h3>Editar Tarefa</h3>

              <div className="inputGroup" role="group">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  type="text"
                  {...register('nome')}
                  aria-invalid={errors.nome ? "true" : "false"}
                />
                <ErrorMessage error={errors.nome} />
              </div>

              <div className="inputGroup" role="group">
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                  id="descricao"
                  {...register('descricao')}
                  aria-invalid={errors.descricao ? "true" : "false"}
                />
                <ErrorMessage error={errors.descricao} />
              </div>

              <div className="inputGroup" role="group">
                <label htmlFor="setor">Setor</label>
                <input
                  id="setor"
                  type="text"
                  {...register('setor')}
                  aria-invalid={errors.setor ? "true" : "false"}
                />
                <ErrorMessage error={errors.setor} />
              </div>

              <div className="inputGroup" role="group">
                <label htmlFor="prioridade">Prioridade</label>
                <select
                  id="prioridade"
                  {...register('prioridade')}
                  aria-invalid={errors.prioridade ? "true" : "false"}
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                <ErrorMessage error={errors.prioridade} />
              </div>

              <div className="inputGroup" role="group">
                <label htmlFor="criador">Criador</label>
                <select 
                  id="criador" 
                  {...register('criador', { valueAsNumber: true })}
                  aria-invalid={errors.criador ? "true" : "false"}
                >
                  <option value="">Selecione o criador</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.criador} />
              </div>

              <div className="inputGroup" role="group">
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  {...register('status')}
                  aria-invalid={errors.status ? "true" : "false"}
                >
                  <option value="">Selecione o status</option>
                  <option value="Fazer">Fazer</option>
                  <option value="Fazendo">Fazendo</option>
                  <option value="Feito">Feito</option>
                </select>
                <ErrorMessage error={errors.status} />
              </div>

              <div>
                <button type="submit">Salvar</button>
              </div>
            </form>
          )}

          {modalType === "delete" && (
            <div className="modalEdit" aria-label="Confirmação de exclusão">
              <h3>Tem certeza que deseja excluir?</h3>
              <div className="btnsDelete">
                <button onClick={handleDelete}>Confirmar</button>
                <button onClick={onCloseModal}>Cancelar</button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </section>
  );
}
