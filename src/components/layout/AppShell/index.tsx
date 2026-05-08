import { Brain, CheckSquare, Gift, LayoutDashboard, Timer } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
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

export function AppShell() {
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
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>Bem-vindo</span>
            <strong>Organize seu foco de forma leve.</strong>
          </div>

          <div className={styles.userBadge}>JV</div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}