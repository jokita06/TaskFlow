import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "../components/Card";
import api from "../service/Service";
import "../styles/managementTask.scss";

// Componente de Coluna
function Column({ id, title }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <article ref={setNodeRef} className="column">
      <h3 className="titleColumn">{title}</h3>
      <Card status={id} />
    </article>
  );
}

export function ManagementTask() {
  const [allTasks, setAllTasks] = useState([]);

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
    if (!over) return;

    const fromColumn = active.data.current.column;
    const toColumn = over.id;

    if (fromColumn !== toColumn) {
      try {

        await api.patch(`tarefas/${active.id}`, { status: toColumn });

        setAllTasks((prev) =>
          prev.map((task) =>
            task.id === active.id ? { ...task, status: toColumn } : task
          )
        );

        console.log(`Tarefa ${active.id} movida de ${fromColumn} → ${toColumn}`);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      }
    }
  };

  return (
    <main>
      <section className="managementTask">
        <h2>Tarefas</h2>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="managementCard">
            <Column id="Fazer" title="Fazer" />
            <Column id="Fazendo" title="Fazendo" />
            <Column id="Feito" title="Feito" />
          </div>
        </DndContext>
      </section>
    </main>
  );
}
