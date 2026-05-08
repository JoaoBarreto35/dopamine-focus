import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import styles from "./styles.module.css";

const tasks = [
  {
    id: "1",
    title: "Organizar material de estudo",
    priority: "Média",
    status: "Pendente",
  },
  {
    id: "2",
    title: "Fazer uma sessão de foco",
    priority: "Alta",
    status: "Em andamento",
  },
  {
    id: "3",
    title: "Revisar tarefas concluídas",
    priority: "Baixa",
    status: "Pendente",
  },
];

export function Tasks() {
  return (
    <>
      <PageHeader
        title="Tarefas"
        description="Cadastre, organize e acompanhe suas tarefas de forma simples."
        action={
          <Button type="button">
            <Plus size={18} />
            Nova tarefa
          </Button>
        }
      />

      <section className={styles.taskList}>
        {tasks.map((task) => (
          <article key={task.id} className={styles.taskCard}>
            <div>
              <h2>{task.title}</h2>
              <p>Prioridade: {task.priority}</p>
            </div>

            <span>{task.status}</span>
          </article>
        ))}
      </section>
    </>
  );
}