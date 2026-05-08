import { Play, RotateCcw } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import styles from "./styles.module.css";

export function Focus() {
  return (
    <>
      <PageHeader
        title="Foco"
        description="Use sessões curtas de concentração para vencer a procrastinação e registrar seu progresso."
      />

      <section className={styles.focusCard}>
        <span>Sessão de foco</span>
        <strong>25:00</strong>
        <p>Escolha uma tarefa, inicie o timer e mantenha o foco até o final.</p>

        <div className={styles.actions}>
          <Button type="button">
            <Play size={18} />
            Iniciar foco
          </Button>

          <Button type="button" variant="secondary">
            <RotateCcw size={18} />
            Reiniciar
          </Button>
        </div>
      </section>
    </>
  );
}