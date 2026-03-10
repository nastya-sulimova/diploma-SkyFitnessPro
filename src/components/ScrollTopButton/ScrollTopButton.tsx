"use client";

import { useState, useEffect } from "react";
import styles from "./scrollTopButton.module.css";

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

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
