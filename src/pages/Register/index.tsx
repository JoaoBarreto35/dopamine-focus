import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import styles from "./styles.module.css";

export function Register() {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.header}>
          <span>Dopamine Focus</span>
          <h1>Criar conta</h1>
          <p>Comece a organizar suas tarefas com foco e recompensas.</p>
        </div>

        <form className={styles.form}>
          <label>
            Nome
            <input type="text" placeholder="Seu nome" />
          </label>

          <label>
            E-mail
            <input type="email" placeholder="seuemail@exemplo.com" />
          </label>

          <label>
            Senha
            <input type="password" placeholder="Crie uma senha" />
          </label>

          <Button type="button">Criar conta</Button>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}