import React from "react";
import styles from "../UploadComponent/index.module.css";
import Checkbox from "../CheckBox";
import ProgressBar from "../ProgressBar";

const InfoCard = ({
  files,
  handleRemoveFile,
  handleCheckboxChange,
  showModal,
  selectedFileIndex,
}) => {
  return (
    <div className={`${files?.length > 2 && styles.wrap}`}>
      {files?.map((fileObj, index) => (
        <div key={index} className={styles.profileContainer}>
          <div className={styles.avatar}>
            <img src={fileObj?.preview} alt="avatar" />
            {fileObj?.progress < 100 && <div className={styles.overlay}></div>}
          </div>
          <div className={styles.details}>
            <div>
              <h3>{fileObj?.file.name}</h3>
              <p>{(fileObj?.file.size / 1024).toFixed(2)} KB</p>
              {fileObj?.showSuccess ? (
                <img
                  src="/images/icons/close.svg"
                  className={styles.closeIcon}
                  alt="Close"
                  onClick={() => handleRemoveFile(index)}
                />
              ) : (
                <div className={styles.checkContainer}>
                  <Checkbox
                    checked={selectedFileIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
              )}
            </div>
            {fileObj?.progress === 100 ? (
              fileObj?.showSuccess ? (
                <div className={styles.successUpload}>
                  <img src="/images/icons/greenCheck.svg" alt="Check" />
                  <h6>Upload success!</h6>
                </div>
              ) : (
                <div className={styles.actions}>
                  {files?.length > 1 && (
                    <>
                      <div
                        className={styles.cropImage}
                        onClick={() => showModal(fileObj, index, "crop")}
                      >
                        <img src="/images/icons/crop.svg" alt="Crop" />
                        <h6>Crop image</h6>
                      </div>
                      <div className="dot" style={{ background: "#525252" }} />
                    </>
                  )}

                  <div
                    className={styles.deleteImage}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <img src="/images/icons/delete.svg" alt="Delete" />
                    <h6>Delete</h6>
                  </div>
                </div>
              )
            ) : (
              <ProgressBar progress={fileObj?.progress} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoCard;
