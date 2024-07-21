import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Card from "../UI/Card";
import Upload from "../Upload";

const Main = () => {
  const [profile, setProfile] = useState("./images/avatar.jpg");
  const [confirmation, setConfirmation] = useState(false);
  const [open, close] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const handleModal = () => {
    close(!open);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        close(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={`${styles.toast} ${confirmation ? styles.visible : ""}`}>
        {confirmation && confirmation}
      </div>
      <div
        className={`${styles.toast} ${errorToast ? styles.ErrorVisible : ""}`}
      >
        {errorToast && <h6>Error: Upload up to 5 images</h6>}
      </div>
      <Card handleModal={handleModal} profile={profile} />
      {/* {open && <Upload handleModal={handleModal} open={open} />} */}
      <Upload
        handleModal={handleModal}
        open={open}
        setProfile={setProfile}
        setConfirmation={setConfirmation}
        setErrorToast={setErrorToast}
      />
    </div>
  );
};

export default Main;
