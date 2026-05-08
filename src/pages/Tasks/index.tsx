import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import {
  completeTask,
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../../services/taskService";
import type { Task, TaskPriority, TaskStatus } from "../../types/database";
import styles from "./styles.module.css";

type TaskFormState = {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
};

const initialFormState: TaskFormState = {
  title: "",
  description: "",
  priority: "medium",
  due_date: "",
};

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
  archived: "Arquivada",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export function Tasks() {
  const { refreshProfile } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [formState, setFormState] = useState<TaskFormState>(initialFormState);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const openTasks = useMemo(
    () => tasks.filter((task) => task.status !== "completed" && task.status !== "archived"),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks]
  );

  async function loadTasks() {
    try {
      setErrorMessage("");
      setLoading(true);

      const taskList = await listTasks();
      setTasks(taskList);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as tarefas.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = formState.title.trim();
    const cleanDescription = formState.description.trim();

    if (cleanTitle.length < 3) {
      setErrorMessage("A tarefa precisa ter pelo menos 3 caracteres.");
      return;
    }

    try {
      setErrorMessage("");
      setCreating(true);

      const newTask = await createTask({
        title: cleanTitle,
        description: cleanDescription.length > 0 ? cleanDescription : null,
        priority: formState.priority,
        due_date: formState.due_date || null,
      });

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setFormState(initialFormState);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a tarefa.";

      setErrorMessage(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleChangeStatus(taskId: string, status: TaskStatus) {
    try {
      setErrorMessage("");
      setActionTaskId(taskId);

      const updatedTask = await updateTask(taskId, { status });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a tarefa.";

      setErrorMessage(message);
    } finally {
      setActionTaskId(null);
    }
  }

  async function handleCompleteTask(taskId: string) {
    try {
      setErrorMessage("");
      setActionTaskId(taskId);

      const updatedTask = await completeTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );

      await refreshProfile();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a tarefa.";

      setErrorMessage(message);
    } finally {
      setActionTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      setErrorMessage("");
      setActionTaskId(taskId);

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a tarefa.";

      setErrorMessage(message);
    } finally {
      setActionTaskId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="Cadastre, organize e acompanhe suas tarefas de forma simples."
      />

      <section className={styles.summaryGrid}>
        <article>
          <span>Abertas</span>
          <strong>{openTasks.length}</strong>
        </article>

        <article>
          <span>Concluídas</span>
          <strong>{completedTasks.length}</strong>
        </article>

        <article>
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </article>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formHeader}>
          <h2>Nova tarefa</h2>
          <p>Crie uma tarefa pequena e clara para facilitar o início.</p>
        </div>

        <form className={styles.form} onSubmit={handleCreateTask}>
          <label className={styles.fullField}>
            Título
            <input
              type="text"
              placeholder="Ex: Estudar React por 25 minutos"
              value={formState.title}
              onChange={(event) =>
                setFormState((currentState) => ({
                  ...currentState,
                  title: event.target.value,
                }))
              }
              required
            />
          </label>

          <label className={styles.fullField}>
            Descrição
            <textarea
              placeholder="Detalhe o que precisa ser feito"
              value={formState.description}
              onChange={(event) =>
                setFormState((currentState) => ({
                  ...currentState,
                  description: event.target.value,
                }))
              }
            />
          </label>

          <label>
            Prioridade
            <select
              value={formState.priority}
              onChange={(event) =>
                setFormState((currentState) => ({
                  ...currentState,
                  priority: event.target.value as TaskPriority,
                }))
              }
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </label>

          <label>
            Data limite
            <input
              type="date"
              value={formState.due_date}
              onChange={(event) =>
                setFormState((currentState) => ({
                  ...currentState,
                  due_date: event.target.value,
                }))
              }
            />
          </label>

          <div className={styles.formActions}>
            <Button type="submit" disabled={creating}>
              {creating ? <Loader2 size={18} /> : <Plus size={18} />}
              {creating ? "Criando..." : "Criar tarefa"}
            </Button>
          </div>
        </form>
      </section>

      {errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : null}

      <section className={styles.taskSection}>
        <div className={styles.sectionHeader}>
          <h2>Minhas tarefas</h2>
          <span>{tasks.length} cadastrada{tasks.length === 1 ? "" : "s"}</span>
        </div>

        {loading ? (
          <div className={styles.stateCard}>
            <Loader2 size={22} />
            <strong>Carregando tarefas...</strong>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.stateCard}>
            <strong>Nenhuma tarefa criada ainda.</strong>
            <p>Crie sua primeira tarefa para começar a ganhar clareza.</p>
          </div>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => {
              const isLoadingAction = actionTaskId === task.id;
              const isCompleted = task.status === "completed";

              return (
                <article key={task.id} className={styles.taskCard}>
                  <div className={styles.taskContent}>
                    <div className={styles.taskTitleRow}>
                      <h3>{task.title}</h3>

                      <span className={styles[task.priority]}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>

                    {task.description ? <p>{task.description}</p> : null}

                    <div className={styles.taskMeta}>
                      <span>Status: {statusLabels[task.status]}</span>

                      {task.due_date ? (
                        <span>Data limite: {formatDate(task.due_date)}</span>
                      ) : null}

                      <span>XP: {task.xp_reward}</span>
                    </div>
                  </div>

                  <div className={styles.taskActions}>
                    {!isCompleted ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isLoadingAction}
                          onClick={() =>
                            handleChangeStatus(
                              task.id,
                              task.status === "in_progress" ? "pending" : "in_progress"
                            )
                          }
                        >
                          {task.status === "in_progress"
                            ? "Voltar"
                            : "Iniciar"}
                        </Button>

                        <Button
                          type="button"
                          disabled={isLoadingAction}
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <Check size={18} />
                          Concluir
                        </Button>
                      </>
                    ) : null}

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isLoadingAction}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={18} />
                      Excluir
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
  }).format(new Date(date));
}