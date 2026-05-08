import { Award, Flame, Star } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import styles from "./styles.module.css";

const rewards = [
  {
    title: "Primeiro foco",
    description: "Complete sua primeira sessão de foco.",
    icon: Star,
  },
  {
    title: "Sequência inicial",
    description: "Use o app por 3 dias seguidos.",
    icon: Flame,
  },
  {
    title: "Organização em evolução",
    description: "Conclua 10 tarefas.",
    icon: Award,
  },
];

export function Rewards() {
  return (
    <>
      <PageHeader
        title="Recompensas"
        description="Visualize conquistas, badges e marcos de evolução."
      />

      <section className={styles.rewardGrid}>
        {rewards.map((reward) => {
          const Icon = reward.icon;

          return (
            <article key={reward.title} className={styles.rewardCard}>
              <div className={styles.icon}>
                <Icon size={26} />
              </div>

              <h2>{reward.title}</h2>
              <p>{reward.description}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}