import type { ReactNode } from "react";
import styles from "./styles.module.css";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <section className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  );
}