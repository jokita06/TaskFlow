// ManagementTask.jsx
import { useEffect, useState } from "react";
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import api from "../service/Service";
import { Card } from "../components/Card";
import "../styles/managementTask.scss";

function Column({ id, title, tasks, setAllTasks }) {
	const { setNodeRef, isOver } = useDroppable({ 
		id,
		data: {
			type: "column",
			title
		}
	});

	return (
		<section 
			ref={setNodeRef} 
			className={`column ${isOver ? "column-over" : ""}`}
			aria-labelledby={`column-title-${id}`}
			aria-describedby={`column-description-${id}`}
		>
			<div className="column-header">
				<h3 id={`column-title-${id}`} className="column-title">
					{title}
				</h3>
				<span id={`column-description-${id}`} className="column-count">
					{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
				</span>
			</div>
			<div className="column-content">
				<Card 
					tasks={tasks} 
					status={id} 
					setAllTasks={setAllTasks} 
					aria-label={`Tarefas em ${title}`}
				/>
			</div>
		</section>
	);
}

export function ManagementTask() {
	const [allTasks, setAllTasks] = useState([]);
	const [activeId, setActiveId] = useState(null);

	useEffect(() => {
		async function fetchTasks() {
			try {
				const response = await api.get("tarefas/");
				setAllTasks(response.data);
			} catch (error) {
				console.error("Erro ao buscar tarefas:", error);
			}
		}
		fetchTasks();
	}, []);

	const handleDragEnd = async (event) => {
		const { active, over } = event;
		setActiveId(null);
		
		if (!over) return;

		const fromColumn = active.data.current?.column;
		const toColumn = over.id;

		if (fromColumn !== toColumn) {
			try {
				await api.patch(`tarefas/${active.id}`, { status: toColumn });
				setAllTasks((prev) =>
					prev.map((task) =>
						task.id === Number(active.id) ? { ...task, status: toColumn } : task
					)
				);
				console.log(`Tarefa ${active.id} movida de ${fromColumn} → ${toColumn}`);
			} catch (error) {
				console.error("Erro ao atualizar status:", error);
			}
		}
	};

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};

	const getActiveTask = () =>
		allTasks.find((task) => task.id === Number(activeId));

	return (
		<main aria-labelledby="page-title">
			<section className="management-task">
				<header className="management-header">
					<h1 id="page-title" className="management-title">
						Suas Tarefas
					</h1>
					<p className="management-description">
						Organize suas tarefas arrastando entre as colunas
					</p>
				</header>

				<DndContext
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					accessibility={{
						screenReaderInstructions: {
							draggable: "Para pegar uma tarefa, pressione espaço ou enter. Use as setas para mover entre colunas e solte com espaço ou enter."
						}
					}}
				>
					<fieldset className="management-card" aria-label="Quadro de tarefas">
						<Column
							id="Fazer"
							title="Fazer"
							tasks={allTasks.filter((t) => t.status === "Fazer")}
							setAllTasks={setAllTasks}
						/>
						<Column
							id="Fazendo"
							title="Fazendo"
							tasks={allTasks.filter((t) => t.status === "Fazendo")}
							setAllTasks={setAllTasks}
						/>
						<Column
							id="Feito"
							title="Feito"
							tasks={allTasks.filter((t) => t.status === "Feito")}
							setAllTasks={setAllTasks}
						/>
					</fieldset>

					<DragOverlay>
						{activeId ? (
							<Card
								key={activeId}
								tasks={getActiveTask() ? [getActiveTask()] : []}
								status={getActiveTask()?.status}
								setAllTasks={setAllTasks}
								isDragging
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			</section>
		</main>
	);
}
