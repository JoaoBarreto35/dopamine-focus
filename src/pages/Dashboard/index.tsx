import { Flame, ListChecks, Loader2, Medal, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { listTasks } from "../../services/taskService";
import type { Task } from "../../types/database";
import styles from "./styles.module.css";

export function Dashboard() {
  const { profile } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const currentXp = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const currentStreak = profile?.streak_count ?? 0;

  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = currentXp - xpForCurrentLevel;
  const xpMissing = Math.max(0, xpForNextLevel - currentXp);

  const openTasksCount = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== "completed" && task.status !== "archived"
      ).length,
    [tasks]
  );

  const completedTasksCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardTasks() {
      try {
        setLoadingTasks(true);

        const taskList = await listTasks();

        if (isMounted) {
          setTasks(taskList);
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas do dashboard:", error);
      } finally {
        if (isMounted) {
          setLoadingTasks(false);
        }
      }
    }

    loadDashboardTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = [
    {
      label: "Nível atual",
      value: String(currentLevel),
      description: "Continue concluindo tarefas para evoluir.",
      icon: Medal,
    },
    {
      label: "XP acumulado",
      value: String(currentXp),
      description: `Faltam ${xpMissing} XP para o próximo nível.`,
      icon: Flame,
    },
    {
      label: "Sequência",
      value: `${currentStreak} dia${currentStreak === 1 ? "" : "s"}`,
      description: "Registre foco diariamente para manter a sequência.",
      icon: Timer,
    },
    {
      label: "Tarefas abertas",
      value: loadingTasks ? "..." : String(openTasksCount),
      description: `${completedTasksCount} tarefa${completedTasksCount === 1 ? "" : "s"} concluída${completedTasksCount === 1 ? "" : "s"}.`,
      icon: ListChecks,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Acompanhe seu progresso, suas tarefas e sua evolução dentro do Dopamine Focus."
      />

      <section className={styles.progressPanel}>
        <div>
          <span>Progresso do nível</span>
          <strong>
            {xpProgress}/100 XP
          </strong>
        </div>

        <div className={styles.progressBar}>
          <div style={{ width: `${Math.min(xpProgress, 100)}%` }} />
        </div>
      </section>

      <section className={styles.grid}>
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className={styles.card}>
              <div className={styles.cardIcon}>
                <Icon size={22} />
              </div>

              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.description}</p>
            </article>
          );
        })}
      </section>

      <section className={styles.panel}>
        <div>
          <h2>Próximo passo recomendado</h2>
          <p>
            Comece por uma tarefa simples e use uma sessão de foco curta para
            gerar progresso sem sobrecarga.
          </p>
        </div>

        {loadingTasks ? (
          <div className={styles.loadingHint}>
            <Loader2 size={18} />
            Carregando tarefas...
          </div>
        ) : null}
      </section>
    </>
  );
}