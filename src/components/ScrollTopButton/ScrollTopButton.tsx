"use client";

import styles from "./scrollTopButton.module.css";

export default function ScrollTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.scrollTopBlock}>
      <button
        className={styles.scrollTop}
        onClick={scrollToTop}
        aria-label="Наверх"
      >
        Наверх ↑
      </button>
    </div>
  );
}
