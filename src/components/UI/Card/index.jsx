import React from "react";
import styles from "./index.module.css";
import PrimaryButton from "../Button/primary";

const Card = ({ handleModal, profile }) => {
  return (
    <div className={styles.card}>
      <img className={styles.coverIcon} src="/images/cover.jpg" alt="cover" />
      <div className={styles.info}>
        <div className={styles.avatar}>
          <img src={profile} alt="avatar" />
        </div>
        <div className={styles.container}>
          <PrimaryButton
            name="Update picture"
            handleModal={handleModal}
            variant={"secondary"}
          />
        </div>
        <h3 className={styles.name}>Jack Smith</h3>
        <div className={styles.details}>
          <h2>@kingjack</h2>
          <div className="dot hide" />
          <div className={styles.occupation}>
            <h2>Senior Product Designer</h2>
            <h2 className={styles.flow}>
              <span>&nbsp;at</span>
              <img src="/images/icons/webFlow.svg" alt="Webflow" /> Webflow{" "}
              <div className="dot" />
              <span>He/Him</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
