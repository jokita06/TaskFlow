// Card.jsx
import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Modal } from "./Modal";
import api from "../service/Service";
import "../styles/Card.scss";
import "../styles/Form.scss";

function TaskItem({ item, status, onOpenModal, onUpdateStatus }) {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: String(item.id),
		data: { column: status },
	});

	return (
		<div ref={setNodeRef} className="cardItem">
			<div className="dragArea" {...attributes} {...listeners}>
				<h4>{item.nome}</h4>
				<p>Descrição: {item.descricao}</p>
				<p>Prioridade: {item.prioridade}</p>
				<p>Criador: {item.criador?.username ?? item.criador}</p>

				<div>
					<label>Status:</label>
					<select
						value={item.status}
						onChange={(e) => onUpdateStatus(item.id, e.target.value)}
						className="statusSelect"
					>
						<option value="">Selecione</option>
						<option value="Fazer">Fazer</option>
						<option value="Fazendo">Fazendo</option>
						<option value="Feito">Feito</option>
					</select>
				</div>
			</div>

			<div className="btns">
				<button className="btn" onClick={() => onOpenModal(item, "edit")}>
					Editar
				</button>
				<button className="btn" onClick={() => onOpenModal(item, "delete")}>
					Excluir
				</button>
			</div>
		</div>
	);
}

export function Card({ tasks, status, setAllTasks }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [modalType, setModalType] = useState("");
	const [users, setUsers] = useState([]);
	const [data, setData] = useState({
		nome: "",
		descricao: "",
		prioridade: "",
		criador: "",
		status: "",
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
		setData({
			nome: item.nome,
			descricao: item.descricao,
			prioridade: item.prioridade,
			criador: item.criador?.id ?? item.criador,
			status: item.status,
		});
	};

	const onCloseModal = () => {
		setSelectedItem(null);
		setModalType("");
		setIsModalOpen(false);
	};

	const handleEdit = async (e) => {
		e.preventDefault();
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

	// Nova função: atualiza status (optimistic update + patch)
	const updateStatus = async (id, newStatus) => {
		try {
			// atualização otimista na UI
			setAllTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));

			// persiste no backend
			await api.patch(`tarefas/${id}`, { status: newStatus });
		} catch (error) {
			console.error("Erro ao atualizar status:", error);
			// opcional: reverter o optimistic update ou refetch
			// aqui podemos refazer a lista do servidor se necessário
		}
	};

	return (
		<div className="card">
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
						<form className="modalEdit" onSubmit={handleEdit}>
							<h3>Editar Tarefa</h3>

							<div className="inputGroup">
								<label>Nome</label>
								<input
									type="text"
									value={data.nome}
									onChange={(e) => setData({ ...data, nome: e.target.value })}
								/>
							</div>

							<div className="inputGroup">
								<label>Descrição:</label>
								<textarea
									value={data.descricao}
									onChange={(e) => setData({ ...data, descricao: e.target.value })}
								/>
							</div>

							<div className="inputGroup">
								<label>Prioridade</label>
								<select
									value={data.prioridade}
									onChange={(e) => setData({ ...data, prioridade: e.target.value })}
								>
									<option value="">Selecione</option>
									<option value="Alta">Alta</option>
									<option value="Média">Média</option>
									<option value="Baixa">Baixa</option>
								</select>
							</div>

							<div className="inputGroup">
								<label>Criador</label>
								<select
									value={data.criador}
									onChange={(e) => setData({ ...data, criador: parseInt(e.target.value) })}
								>
									<option value="">Selecione</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{user.username}
										</option>
									))}
								</select>
							</div>

							<div className="inputGroup">
								<label>Status</label>
								<select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
									<option value="">Selecione</option>
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

					{modalType === "delete" && (
						<div className="modalEdit">
							<h3>Tem certeza que deseja excluir?</h3>
							<div className="btnsDelete">
								<button onClick={handleDelete}>Confirmar</button>
								<button onClick={onCloseModal}>Cancelar</button>
							</div>
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
