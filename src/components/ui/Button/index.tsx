import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className}`.trim();

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}