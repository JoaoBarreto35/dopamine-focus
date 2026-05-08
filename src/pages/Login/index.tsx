import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import styles from "./styles.module.css";

export function Login() {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.header}>
          <span>Dopamine Focus</span>
          <h1>Entrar na sua conta</h1>
          <p>Acesse seu painel de foco, tarefas e evolução.</p>
        </div>

        <form className={styles.form}>
          <label>
            E-mail
            <input type="email" placeholder="seuemail@exemplo.com" />
          </label>

          <label>
            Senha
            <input type="password" placeholder="Digite sua senha" />
          </label>

          <Button type="button">Entrar</Button>
        </form>

        <p className={styles.footerText}>
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}