import { Loader2, Pause, Play, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { registerFocusSession } from "../../services/focusSessionService";
import { listTasks } from "../../services/taskService";
import type { Task } from "../../types/database";
import styles from "./styles.module.css";

const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_FOCUS_SECONDS = DEFAULT_FOCUS_MINUTES * 60;

type TimerStatus = "idle" | "running" | "paused" | "finished";

export function Focus() {
  const { refreshProfile } = useAuth();

  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_FOCUS_SECONDS);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [savingSession, setSavingSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const elapsedSeconds = DEFAULT_FOCUS_SECONDS - remainingSeconds;
  const progressPercentage = Math.round(
    (elapsedSeconds / DEFAULT_FOCUS_SECONDS) * 100
  );

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const canSaveSession =
    timerStatus === "finished" || elapsedSeconds >= 60;

  useEffect(() => {
    let isMounted = true;

    async function loadOpenTasks() {
      try {
        setLoadingTasks(true);

        const taskList = await listTasks();

        const openTasks = taskList.filter(
          (task) => task.status !== "completed" && task.status !== "archived"
        );

        if (isMounted) {
          setTasks(openTasks);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as tarefas.";

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoadingTasks(false);
        }
      }
    }

    loadOpenTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (timerStatus !== "running") {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          clearCurrentInterval();
          setTimerStatus("finished");
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => {
      clearCurrentInterval();
    };
  }, [timerStatus]);

  function clearCurrentInterval() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handleStartTimer() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!startedAtRef.current) {
      startedAtRef.current = new Date().toISOString();
    }

    setTimerStatus("running");
  }

  function handlePauseTimer() {
    clearCurrentInterval();
    setTimerStatus("paused");
  }

  function handleResetTimer() {
    clearCurrentInterval();
    startedAtRef.current = null;
    setRemainingSeconds(DEFAULT_FOCUS_SECONDS);
    setTimerStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSaveSession() {
    const durationMinutes = Math.max(1, Math.floor(elapsedSeconds / 60));

    if (durationMinutes < 1) {
      setErrorMessage("Faça pelo menos 1 minuto de foco antes de salvar.");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      setSavingSession(true);

      const startedAt = startedAtRef.current ?? new Date().toISOString();
      const finishedAt = new Date().toISOString();

      await registerFocusSession({
        taskId: selectedTaskId || null,
        durationMinutes,
        startedAt,
        finishedAt,
      });

      await refreshProfile();

      setSuccessMessage(
        `Sessão registrada com sucesso! Você ganhou ${durationMinutes} XP.`
      );

      clearCurrentInterval();
      startedAtRef.current = null;
      setRemainingSeconds(DEFAULT_FOCUS_SECONDS);
      setTimerStatus("idle");
      setSelectedTaskId("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a sessão de foco.";

      setErrorMessage(message);
    } finally {
      setSavingSession(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Foco"
        description="Use sessões curtas de concentração para vencer a procrastinação e registrar seu progresso."
      />

      <section className={styles.focusLayout}>
        <article className={styles.focusCard}>
          <span className={styles.kicker}>Sessão de foco</span>

          <strong className={styles.timer}>
            {formatTimer(remainingSeconds)}
          </strong>

          <div className={styles.progressBar}>
            <div style={{ width: `${progressPercentage}%` }} />
          </div>

          <p>
            Escolha uma tarefa, inicie o timer e mantenha o foco até o final.
            Você ganha XP proporcional ao tempo focado.
          </p>

          <div className={styles.actions}>
            {timerStatus === "running" ? (
              <Button type="button" variant="secondary" onClick={handlePauseTimer}>
                <Pause size={18} />
                Pausar
              </Button>
            ) : (
              <Button type="button" onClick={handleStartTimer}>
                <Play size={18} />
                {timerStatus === "paused" ? "Continuar" : "Iniciar foco"}
              </Button>
            )}

            <Button type="button" variant="secondary" onClick={handleResetTimer}>
              <RotateCcw size={18} />
              Reiniciar
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!canSaveSession || savingSession}
              onClick={handleSaveSession}
            >
              {savingSession ? <Loader2 size={18} /> : <Save size={18} />}
              {savingSession ? "Salvando..." : "Salvar sessão"}
            </Button>
          </div>

          {errorMessage ? (
            <p className={styles.errorMessage}>{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className={styles.successMessage}>{successMessage}</p>
          ) : null}
        </article>

        <aside className={styles.sidePanel}>
          <div>
            <h2>Tarefa vinculada</h2>
            <p>
              Vincular uma tarefa ajuda a saber onde seu tempo de foco foi usado.
            </p>
          </div>

          <label>
            Selecionar tarefa
            <select
              value={selectedTaskId}
              disabled={loadingTasks || timerStatus === "running"}
              onChange={(event) => setSelectedTaskId(event.target.value)}
            >
              <option value="">
                {loadingTasks ? "Carregando tarefas..." : "Sem tarefa vinculada"}
              </option>

              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </label>

          {selectedTask ? (
            <div className={styles.selectedTaskCard}>
              <span>Tarefa selecionada</span>
              <strong>{selectedTask.title}</strong>

              {selectedTask.description ? (
                <p>{selectedTask.description}</p>
              ) : null}
            </div>
          ) : (
            <div className={styles.emptyTaskCard}>
              <strong>Nenhuma tarefa selecionada</strong>
              <p>Você ainda pode salvar foco sem vincular uma tarefa.</p>
            </div>
          )}

          <div className={styles.rulesCard}>
            <h3>Regras desta fase</h3>

            <ul>
              <li>1 minuto focado = 1 XP.</li>
              <li>Sessões abaixo de 1 minuto não são salvas.</li>
              <li>Salvar foco atualiza sua sequência diária.</li>
              <li>Ao salvar, o Dashboard atualiza seu XP e streak.</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}