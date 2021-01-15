import React from "react";
import confetti from "canvas-confetti";
import appStyles from "../../App.module.css";
import styles from "./Submitted.module.css";

export const Submitted = () => {
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <main className={styles.main}>
      <article className={`${appStyles.container} ${styles.intro}`}>
        <h1>Congratulations on your submission! 🎊🎈</h1>
        <h3 className={styles.description}>
          We really hove your movies get nominated for a Shoppie
        </h3>
        <button
          onClick={launchConfetti}
          className={`${appStyles.btnPrimary} ${styles.celebrate}`}
        >
          Celebrate <span className={styles.celebrateIcon}>🎉</span>
        </button>
      </article>
    </main>
  );
};
