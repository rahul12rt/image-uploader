import React from "react";
import styles from "./index.module.css";

const Checkbox = ({ checked, onChange }) => {
  return (
    <div className={styles.checkboxContainer} onClick={onChange}>
      <div className={`${styles.checkbox} ${checked ? styles.checked : ""}`}>
        {checked && <div className={styles.innerCircle} />}
      </div>
    </div>
  );
};

export default Checkbox;
