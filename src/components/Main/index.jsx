import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Card from "../UI/Card";
import Upload from "../Upload";

const Main = () => {
  const [profile, setProfile] = useState("./images/avatar.jpg");
  const [confirmation, setConfirmation] = useState(false);
  const [open, close] = useState(false);
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
        {confirmation && (
          <h6>
            <span>Success</span> Changes saved successfully
          </h6>
        )}
      </div>
      <Card handleModal={handleModal} profile={profile} />
      {/* {open && <Upload handleModal={handleModal} open={open} />} */}
      <Upload
        handleModal={handleModal}
        open={open}
        setProfile={setProfile}
        setConfirmation={setConfirmation}
      />
    </div>
  );
};

export default Main;
