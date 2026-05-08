import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { signUp } from "../../services/authService";
import styles from "./styles.module.css";

export function Register() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSubmitting(true);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setSubmitting(false);
      setErrorMessage("Informe um nome com pelo menos 2 caracteres.");
      return;
    }

    const { error } = await signUp({
      name: cleanName,
      email: cleanEmail,
      password,
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.header}>
          <span>Dopamine Focus</span>
          <h1>Criar conta</h1>
          <p>Comece a organizar suas tarefas com foco e recompensas.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}