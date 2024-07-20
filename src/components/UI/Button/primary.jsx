import React from "react";
import styles from "./index.module.css";

const PrimaryButton = ({ name, handleModal, variant, disabled }) => {
  return (
    <button
      className={styles[variant]}
      onClick={handleModal}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default PrimaryButton;
