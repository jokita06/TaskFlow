// ManagementTask.jsx
import { useEffect, useState } from "react";
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import api from "../service/Service";
import { Card } from "../components/Card";
import "../styles/managementTask.scss";

function Column({ id, title, tasks, setAllTasks }) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<article ref={setNodeRef} className="column">
			<h3 className="titleColumn">{title}</h3>
			<Card tasks={tasks} status={id} setAllTasks={setAllTasks} />
		</article>
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

		const fromColumn = active.data.current.column;
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

	const getActiveTask = () =>
		allTasks.find((task) => task.id === Number(activeId));

	return (
		<main>
			<section className="managementTask">
				<h2>Suas Tarefas</h2>

				<DndContext
					onDragStart={(event) => setActiveId(event.active.id)}
					onDragEnd={handleDragEnd}
				>
					<div className="managementCard">
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
					</div>

					<DragOverlay>
						{activeId ? (
							<Card
							key={activeId}
							tasks={getActiveTask() ? [getActiveTask()] : []}
							status={getActiveTask()?.status}
							setAllTasks={setAllTasks}
							/>
						) : null}
					</DragOverlay>

				</DndContext>
			</section>
		</main>
	);
}
