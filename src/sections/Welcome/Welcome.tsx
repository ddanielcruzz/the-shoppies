import React from "react";
import { useHistory } from "react-router-dom";
import appStyles from "../../App.module.css";
import styles from "./Welcome.module.css";

export const Welcome = () => {
  const history = useHistory();
  return (
    <main className={styles.main}>
      <article className={`${appStyles.container} ${styles.intro}`}>
        <h1>Welcome to The Shoppies 🏆🍿</h1>
        <h3 className={styles.description}>
          Vote for your favorite movies and make them eligible for nomination
        </h3>
        <button
          onClick={() => history.push("/nominations")}
          className={`${appStyles.btnPrimary} ${styles.vote}`}
        >
          Start voting <span className={styles.voteIcon}>👍</span>
        </button>
      </article>
    </main>
  );
};
