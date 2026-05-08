import { Flame, ListChecks, Medal, Timer } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import styles from "./styles.module.css";

const summaryCards = [
  {
    label: "Nível atual",
    value: "1",
    description: "Continue concluindo tarefas para evoluir.",
    icon: Medal,
  },
  {
    label: "XP acumulado",
    value: "120",
    description: "Faltam 80 XP para o próximo nível.",
    icon: Flame,
  },
  {
    label: "Tarefas abertas",
    value: "4",
    description: "Escolha uma tarefa pequena para começar.",
    icon: ListChecks,
  },
  {
    label: "Foco hoje",
    value: "25 min",
    description: "Uma sessão de foco registrada hoje.",
    icon: Timer,
  },
];

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Acompanhe seu progresso, suas tarefas e sua evolução dentro do Dopamine Focus."
      />

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