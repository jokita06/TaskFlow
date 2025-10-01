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
		<article ref={setNodeRef} className="cardItem" aria-label={`Tarefa: ${item.nome}`}>
			<div className="dragArea" {...attributes} {...listeners} role="" aria-label="Área de arrastar">
				<h4>{item.nome}</h4>
				<p>Descrição: {item.descricao}</p>
				<p>Prioridade: {item.prioridade}</p>
				<p>Criador: {item.criador?.username ?? item.criador}</p>

				<div role="group">
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
						<form className="modalEdit" onSubmit={handleEdit}>
							<h3>Editar Tarefa</h3>

							<div className="inputGroup" role="group">
								<label htmlFor="name">Nome</label>
								<input
									id="name"
									type="text"
									value={data.nome}
									onChange={(e) => setData({ ...data, nome: e.target.value })}
								/>
							</div>

							<div className="inputGroup" role="group">
								<label htmlFor="descricao">Descrição:</label>
								<textarea
									id="descricao"
									value={data.descricao}
									onChange={(e) => setData({ ...data, descricao: e.target.value })}
								/>
							</div>

							<div className="inputGroup" role="group">
								<label htmlFor="prioridade">Prioridade</label>
								<select
									id="prioridade"
									value={data.prioridade}
									onChange={(e) => setData({ ...data, prioridade: e.target.value })}
								>
									<option value="">Selecione</option>
									<option value="Alta">Alta</option>
									<option value="Média">Média</option>
									<option value="Baixa">Baixa</option>
								</select>
							</div>

							<div cclassName="inputGroup" role="group">
								<label htmlFor="criador">Criador</label>
								<select id="criador" value={data.criador} onChange={(e) => setData({ ...data, criador: parseInt(e.target.value) })}>
									<option value="">Selecione</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{user.username}
										</option>
									))}
								</select>
							</div>

							<div className="inputGroup" role="group">
								<label htmlFor="status">Status</label>
								<select id="status" value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
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
