import React from "react";
import styles from "./index.module.css";

const PrimaryButton = ({ name, handleModal, variant, disabled, loader }) => {
  return (
    <button
      className={styles[variant]}
      onClick={handleModal}
      disabled={disabled}
    >
      {loader ? "Updating..." : name}
    </button>
  );
};

export default PrimaryButton;
