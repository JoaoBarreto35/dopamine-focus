import {
  Award,
  CheckCircle2,
  Flame,
  Lock,
  Loader2,
  Medal,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  listAchievements,
  listUserAchievements,
  type UserAchievementWithDetails,
} from "../../services/achievementService";
import type { Achievement } from "../../types/database";
import styles from "./styles.module.css";

type AchievementView = Achievement & {
  unlocked: boolean;
  unlocked_at: string | null;
};

const iconMap = {
  star: Star,
  flame: Flame,
  award: Award,
  medal: Medal,
  check: CheckCircle2,
  trophy: Trophy,
};

export function Rewards() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<
    UserAchievementWithDetails[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const achievementViews = useMemo<AchievementView[]>(() => {
    return achievements.map((achievement) => {
      const unlockedAchievement = userAchievements.find(
        (userAchievement) =>
          userAchievement.achievement_id === achievement.id
      );

      return {
        ...achievement,
        unlocked: Boolean(unlockedAchievement),
        unlocked_at: unlockedAchievement?.unlocked_at ?? null,
      };
    });
  }, [achievements, userAchievements]);

  const unlockedCount = achievementViews.filter(
    (achievement) => achievement.unlocked
  ).length;

  const totalCount = achievementViews.length;

  const progressPercentage =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  useEffect(() => {
    let isMounted = true;

    async function loadRewards() {
      try {
        setErrorMessage("");
        setLoading(true);

        const [achievementList, userAchievementList] = await Promise.all([
          listAchievements(),
          listUserAchievements(),
        ]);

        if (isMounted) {
          setAchievements(achievementList);
          setUserAchievements(userAchievementList);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as recompensas.";

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRewards();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Recompensas"
        description="Visualize conquistas, badges e marcos de evolução desbloqueados durante sua jornada."
      />

      <section className={styles.progressPanel}>
        <div>
          <span>Progresso de conquistas</span>
          <strong>
            {unlockedCount}/{totalCount}
          </strong>
        </div>

        <div className={styles.progressBar}>
          <div style={{ width: `${progressPercentage}%` }} />
        </div>

        <p>{progressPercentage}% das conquistas foram desbloqueadas.</p>
      </section>

      {errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : null}

      {loading ? (
        <section className={styles.stateCard}>
          <Loader2 size={24} />
          <strong>Carregando recompensas...</strong>
        </section>
      ) : achievementViews.length === 0 ? (
        <section className={styles.stateCard}>
          <strong>Nenhuma recompensa cadastrada.</strong>
          <p>As conquistas iniciais devem ter sido criadas no SQL da Fase 3.</p>
        </section>
      ) : (
        <section className={styles.rewardGrid}>
          {achievementViews.map((achievement) => {
            const Icon =
              iconMap[achievement.icon as keyof typeof iconMap] ?? Star;

            return (
              <article
                key={achievement.id}
                className={
                  achievement.unlocked
                    ? `${styles.rewardCard} ${styles.unlocked}`
                    : `${styles.rewardCard} ${styles.locked}`
                }
              >
                <div className={styles.cardTop}>
                  <div className={styles.icon}>
                    <Icon size={26} />
                  </div>

                  <span className={styles.statusBadge}>
                    {achievement.unlocked ? (
                      <>
                        <CheckCircle2 size={16} />
                        Desbloqueada
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Bloqueada
                      </>
                    )}
                  </span>
                </div>

                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>

                <div className={styles.footer}>
                  {achievement.unlocked_at ? (
                    <span>
                      Desbloqueada em {formatDateTime(achievement.unlocked_at)}
                    </span>
                  ) : (
                    <span>Continue usando o app para liberar.</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}