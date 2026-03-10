import styles from "./page.module.css";

export default function ProfilePage() {
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Мой профиль</h1>

        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>user@example.com</span>
          </div>
        </div>

        <section className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>Мои курсы</h2>
          <div className={styles.coursesList}>
            {/* Здесь будут карточки купленных курсов */}
            <p className={styles.emptyMessage}>
              У вас пока нет купленных курсов
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
