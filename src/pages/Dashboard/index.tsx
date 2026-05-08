import {
  Award,
  CalendarClock,
  Flame,
  ListChecks,
  Loader2,
  Medal,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../services/dashboardService";
import type { Task } from "../../types/database";
import styles from "./styles.module.css";

export function Dashboard() {
  const { profile } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentXp = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const currentStreak = profile?.streak_count ?? 0;

  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = currentXp - xpForCurrentLevel;
  const xpMissing = Math.max(0, xpForNextLevel - currentXp);

  const tasks = summary?.tasks ?? [];
  const focusSessionsToday = summary?.focusSessionsToday ?? [];
  const recentFocusSessions = summary?.recentFocusSessions ?? [];
  const recentAchievements = summary?.recentAchievements ?? [];

  const openTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== "completed" && task.status !== "archived"
      ),
    [tasks]
  );

  const completedTasksCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks]
  );

  const focusMinutesToday = useMemo(
    () =>
      focusSessionsToday.reduce(
        (total, session) => total + session.duration_minutes,
        0
      ),
    [focusSessionsToday]
  );

  const recommendedTask = useMemo(() => getRecommendedTask(openTasks), [openTasks]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setErrorMessage("");
        setLoadingData(true);

        const dashboardSummary = await getDashboardSummary();

        if (isMounted) {
          setSummary(dashboardSummary);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o dashboard.";

        if (isMounted) {
          setErrorMessage(message);
        }
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
      value: loadingData ? "..." : String(openTasks.length),
      description: `${completedTasksCount} tarefa${completedTasksCount === 1 ? "" : "s"
        } concluída${completedTasksCount === 1 ? "" : "s"}.`,
      icon: ListChecks,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Acompanhe seu progresso, suas tarefas e sua evolução dentro do Dopamine Focus."
      />

      {errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : null}

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

        <p>
          {xpMissing > 0
            ? `Faltam ${xpMissing} XP para alcançar o nível ${currentLevel + 1
            }.`
            : "Você já pode avançar de nível."}
        </p>
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

      <section className={styles.dashboardGrid}>
        <article className={styles.recommendedPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Próximo passo</span>
              <h2>Tarefa recomendada</h2>
            </div>

            <ListChecks size={22} />
          </div>

          {loadingData ? (
            <div className={styles.loadingHint}>
              <Loader2 size={18} />
              Carregando tarefa...
            </div>
          ) : recommendedTask ? (
            <div className={styles.recommendedTask}>
              <strong>{recommendedTask.title}</strong>

              {recommendedTask.description ? (
                <p>{recommendedTask.description}</p>
              ) : (
                <p>
                  Comece por esta tarefa e use uma sessão curta de foco para
                  gerar movimento.
                </p>
              )}

              <div className={styles.taskMeta}>
                <span>Prioridade: {getPriorityLabel(recommendedTask.priority)}</span>
                <span>XP: {recommendedTask.xp_reward}</span>
              </div>

              <div className={styles.panelActions}>
                <Link to="/focus">
                  <Button type="button">Iniciar foco</Button>
                </Link>

                <Link to="/tasks">
                  <Button type="button" variant="secondary">
                    Ver tarefas
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.emptyBox}>
              <strong>Nenhuma tarefa aberta.</strong>
              <p>Crie uma tarefa para receber uma recomendação no painel.</p>

              <Link to="/tasks">
                <Button type="button">Criar tarefa</Button>
              </Link>
            </div>
          )}
        </article>

        <article className={styles.focusPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Hoje</span>
              <h2>Foco registrado</h2>
            </div>

            <Timer size={22} />
          </div>

          <div className={styles.bigNumber}>
            <strong>{focusMinutesToday}</strong>
            <span>minutos</span>
          </div>

          <p>
            Sessões pequenas e constantes ajudam a manter progresso sem
            sobrecarga.
          </p>
        </article>
      </section>

      <section className={styles.lowerGrid}>
        <article className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Histórico</span>
              <h2>Últimas sessões de foco</h2>
            </div>

            <CalendarClock size={22} />
          </div>

          {loadingData ? (
            <div className={styles.loadingHint}>
              <Loader2 size={18} />
              Carregando sessões...
            </div>
          ) : recentFocusSessions.length === 0 ? (
            <div className={styles.emptyBox}>
              <strong>Nenhuma sessão ainda.</strong>
              <p>Inicie uma sessão de foco para gerar histórico.</p>
            </div>
          ) : (
            <div className={styles.simpleList}>
              {recentFocusSessions.map((session) => (
                <div key={session.id} className={styles.simpleListItem}>
                  <div>
                    <strong>{session.duration_minutes} min de foco</strong>
                    <span>{formatDateTime(session.started_at)}</span>
                  </div>

                  <span className={styles.statusPill}>+{session.duration_minutes} XP</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Conquistas</span>
              <h2>Últimas recompensas</h2>
            </div>

            <Award size={22} />
          </div>

          {loadingData ? (
            <div className={styles.loadingHint}>
              <Loader2 size={18} />
              Carregando conquistas...
            </div>
          ) : recentAchievements.length === 0 ? (
            <div className={styles.emptyBox}>
              <strong>Nenhuma conquista desbloqueada.</strong>
              <p>Conclua tarefas ou sessões de foco para liberar recompensas.</p>
            </div>
          ) : (
            <div className={styles.simpleList}>
              {recentAchievements.map((item) => (
                <div key={item.id} className={styles.simpleListItem}>
                  <div>
                    <strong>{item.achievement.title}</strong>
                    <span>{formatDateTime(item.unlocked_at)}</span>
                  </div>

                  <span className={styles.statusPill}>Badge</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </>
  );
}

function getRecommendedTask(tasks: Task[]): Task | null {
  if (tasks.length === 0) {
    return null;
  }

  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTasks = [...tasks].sort((taskA, taskB) => {
    const priorityDifference =
      priorityWeight[taskB.priority] - priorityWeight[taskA.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(taskA.created_at).getTime() - new Date(taskB.created_at).getTime()
    );
  });

  return sortedTasks[0];
}

function getPriorityLabel(priority: Task["priority"]) {
  const labels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

  return labels[priority];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}