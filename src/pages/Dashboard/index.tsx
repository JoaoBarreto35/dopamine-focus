import { Flame, ListChecks, Loader2, Medal, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { listTodayFocusSessions } from "../../services/focusSessionService";
import { listTasks } from "../../services/taskService";
import type { FocusSession, Task } from "../../types/database";
import styles from "./styles.module.css";

export function Dashboard() {
  const { profile } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  const focusMinutesToday = useMemo(
    () =>
      focusSessions.reduce(
        (total, session) => total + session.duration_minutes,
        0
      ),
    [focusSessions]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoadingData(true);

        const [taskList, todaySessions] = await Promise.all([
          listTasks(),
          listTodayFocusSessions(),
        ]);

        if (isMounted) {
          setTasks(taskList);
          setFocusSessions(todaySessions);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }

    loadDashboardData();

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
      value: loadingData ? "..." : String(openTasksCount),
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
          <h2>Resumo de foco de hoje</h2>
          <p>
            Hoje você registrou <strong>{focusMinutesToday} minuto{focusMinutesToday === 1 ? "" : "s"}</strong> de foco.
            Continue com sessões pequenas para manter constância sem sobrecarga.
          </p>
        </div>

        {loadingData ? (
          <div className={styles.loadingHint}>
            <Loader2 size={18} />
            Carregando dados...
          </div>
        ) : null}
      </section>
    </>
  );
}