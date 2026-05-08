import {
  Brain,
  CheckSquare,
  Gift,
  LayoutDashboard,
  LogOut,
  Timer,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { signOut } from "../../../services/authService";
import styles from "./styles.module.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tarefas",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Foco",
    path: "/focus",
    icon: Timer,
  },
  {
    label: "Recompensas",
    path: "/rewards",
    icon: Gift,
  },
];

function getInitials(name: string) {
  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) {
    return "DF";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function AppShell() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const displayName = profile?.name || user?.email || "Usuário";
  const initials = getInitials(displayName);

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Brain size={24} />
          </div>

          <div>
            <strong>Dopamine Focus</strong>
            <span>Foco gamificado</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Button type="button" variant="ghost" onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>Bem-vindo</span>
            <strong>{displayName}</strong>
          </div>

          <div className={styles.userBadge}>{initials}</div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}