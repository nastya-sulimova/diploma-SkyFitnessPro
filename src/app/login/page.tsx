import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Вход в аккаунт</h1>

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

          <button type="submit" className={styles.button}>
            Войти
          </button>
        </form>

        <p className={styles.registerLink}>
          Ещё нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </main>
  );
}
