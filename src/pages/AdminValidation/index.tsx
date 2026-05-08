import { BarChart3, Loader2, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  getPilotFeedbackSummary,
  listPilotFeedback,
} from "../../services/pilotValidationService";
import type {
  PilotFeedbackSummary,
  PilotFeedbackWithParticipant,
  PilotImprovementGroup,
} from "../../types/database";
import styles from "./styles.module.css";

const improvementLabels: Record<PilotImprovementGroup, string> = {
  large_improvement: "Melhora grande",
  moderate_improvement: "Melhora moderada",
  no_improvement_or_dropout: "Sem melhora ou desistência",
};

const profileLabels = {
  diagnosed_tdah: "TDAH diagnosticado",
  suspected_tdah: "Suspeita de TDAH",
};

const ageRangeLabels = {
  under_18: "Menor de 18",
  "18_24": "18 a 24",
  "25_34": "25 a 34",
  "35_44": "35 a 44",
  "45_plus": "45+",
};

export function AdminValidation() {
  const [summary, setSummary] = useState<PilotFeedbackSummary | null>(null);
  const [feedbackList, setFeedbackList] = useState<PilotFeedbackWithParticipant[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const averageInitialScore = useMemo(() => {
    if (feedbackList.length === 0) {
      return 0;
    }

    const total = feedbackList.reduce(
      (sum, item) => sum + item.initial_focus_score,
      0
    );

    return total / feedbackList.length;
  }, [feedbackList]);

  const averageFinalScore = useMemo(() => {
    if (feedbackList.length === 0) {
      return 0;
    }

    const total = feedbackList.reduce(
      (sum, item) => sum + item.final_focus_score,
      0
    );

    return total / feedbackList.length;
  }, [feedbackList]);

  useEffect(() => {
    let isMounted = true;

    async function loadValidationData() {
      try {
        setErrorMessage("");
        setLoading(true);

        const [summaryData, feedbackData] = await Promise.all([
          getPilotFeedbackSummary(),
          listPilotFeedback(),
        ]);

        if (isMounted) {
          setSummary(summaryData);
          setFeedbackList(feedbackData);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados da validação.";

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadValidationData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Administração da validação"
        description="Visualização das respostas anônimas coletadas na etapa de validação do Dopamine Focus."
      />

      <section className={styles.notice}>
        <ShieldCheck size={22} />
        <div>
          <strong>Dados anônimos</strong>
          <p>
            Esta tela não exibe nome, e-mail, telefone ou qualquer dado direto
            de identificação dos participantes.
          </p>
        </div>
      </section>

      {errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : null}

      {loading ? (
        <section className={styles.loadingCard}>
          <Loader2 size={24} />
          <strong>Carregando dados da validação...</strong>
        </section>
      ) : (
        <>
          <section className={styles.summaryGrid}>
            <article>
              <Users size={22} />
              <span>Total de participantes</span>
              <strong>{summary?.total_participants ?? 0}</strong>
            </article>

            <article>
              <BarChart3 size={22} />
              <span>Melhora grande</span>
              <strong>{summary?.large_improvement_count ?? 0}</strong>
              <small>{summary?.large_improvement_percentage ?? 0}%</small>
            </article>

            <article>
              <BarChart3 size={22} />
              <span>Melhora moderada</span>
              <strong>{summary?.moderate_improvement_count ?? 0}</strong>
              <small>{summary?.moderate_improvement_percentage ?? 0}%</small>
            </article>

            <article>
              <BarChart3 size={22} />
              <span>Sem melhora/desistência</span>
              <strong>{summary?.no_improvement_or_dropout_count ?? 0}</strong>
              <small>{summary?.no_improvement_or_dropout_percentage ?? 0}%</small>
            </article>
          </section>

          <section className={styles.scorePanel}>
            <div>
              <span>Média inicial de foco</span>
              <strong>{averageInitialScore.toFixed(1)}/5</strong>
            </div>

            <div>
              <span>Média final de foco</span>
              <strong>{averageFinalScore.toFixed(1)}/5</strong>
            </div>

            <div>
              <span>Evolução média</span>
              <strong>
                {(averageFinalScore - averageInitialScore).toFixed(1)} ponto(s)
              </strong>
            </div>
          </section>

          <section className={styles.tablePanel}>
            <div className={styles.panelHeader}>
              <h2>Respostas anônimas</h2>
              <span>{feedbackList.length} registro(s)</span>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Perfil</th>
                    <th>Faixa etária</th>
                    <th>Dias</th>
                    <th>Foco inicial</th>
                    <th>Foco final</th>
                    <th>Resultado</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {feedbackList.map((feedback) => (
                    <tr key={feedback.id}>
                      <td>{feedback.participant.participant_code}</td>
                      <td>{profileLabels[feedback.participant.profile_group]}</td>
                      <td>{ageRangeLabels[feedback.participant.age_range]}</td>
                      <td>{feedback.days_observed}</td>
                      <td>{feedback.initial_focus_score}/5</td>
                      <td>{feedback.final_focus_score}/5</td>
                      <td>
                        <span className={styles[feedback.improvement_group]}>
                          {improvementLabels[feedback.improvement_group]}
                        </span>
                      </td>
                      <td>{feedback.qualitative_note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}