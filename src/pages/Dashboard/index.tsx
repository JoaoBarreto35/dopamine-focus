import { Flame, ListChecks, Medal, Timer } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";

export function Dashboard() {
  const { profile } = useAuth();

  const currentXp = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const currentStreak = profile?.streak_count ?? 0;

  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = currentXp - xpForCurrentLevel;
  const xpMissing = Math.max(0, xpForNextLevel - currentXp);

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
      value: "0",
      description: "Na próxima fase vamos buscar tarefas reais.",
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
      </section>
    </>
  );
}