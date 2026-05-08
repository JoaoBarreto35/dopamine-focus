import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./styles.module.css";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <strong>Dopamine Focus</strong>
          <span>Carregando sua sessão...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}