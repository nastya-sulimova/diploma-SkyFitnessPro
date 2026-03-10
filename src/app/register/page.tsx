import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Регистрация</h1>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Введите email"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите пароль"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Повторите пароль"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Зарегистрироваться
          </button>
        </form>

        <p className={styles.loginLink}>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
}
