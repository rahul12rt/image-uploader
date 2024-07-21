import React from "react";
import styles from "./index.module.css";
import UploadComponent from "../UI/UploadComponent";

const Upload = ({
  handleModal,
  open,
  setProfile,
  setConfirmation,
  setErrorToast,
}) => {
  return (
    <>
      <div
        className={`${styles.overLay} ${open ? styles.fadeIn : styles.fadeOut}`}
        onClick={handleModal}
      />

      <div
        className={`${styles.container} ${open ? styles.open : styles.closed}`}
      >
        <div className={styles.wrap}>
          <div className={styles.header}>
            <div>
              <h3>Upload image(s)</h3>
              <p>You may upload up to 5 images</p>
            </div>
            <div className={styles.closeIcon} onClick={handleModal}>
              <img src="./images/icons/close.svg" alt="Close" />
            </div>
          </div>
          <div className={styles.body}>
            <UploadComponent
              handleModal={handleModal}
              setProfile={setProfile}
              setConfirmation={setConfirmation}
              setErrorToast={setErrorToast}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
