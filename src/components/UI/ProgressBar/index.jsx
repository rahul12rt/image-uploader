import React from "react";
import styles from "./index.module.css";

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%`, transition: "width 350ms ease" }}
        ></div>
      </div>
      <h3>{progress}%</h3>
    </div>
  );
};

export default ProgressBar;
