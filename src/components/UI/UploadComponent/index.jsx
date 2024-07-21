import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./index.module.css";
import ProgressBar from "../ProgressBar";
import Checkbox from "../CheckBox";
import PrimaryButton from "../Button/primary";
import ProfileCrop from "../Modal";

const UploadComponent = ({
  handleModal,
  setProfile,
  setConfirmation,
  setErrorToast,
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [isCropMode, setIsCropMode] = useState(false);

  const showModal = (fileSrc, index, mode) => {
    setImageSrc(fileSrc);
    setSelectedFileIndex(index);
    setIsModalOpen(true);
    setIsCropMode(mode);
    handleModal();
  };

  const simulateProgress = (fileIndex) => {
    const intervalId = setInterval(() => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        if (newFiles[fileIndex]) {
          const fileObj = newFiles[fileIndex];
          if (fileObj.progress < 100) {
            fileObj.progress += 10;
            return newFiles;
          } else {
            clearInterval(fileObj.intervalId);
            setTimeout(() => {
              setFiles((prevFiles) => {
                const updatedFiles = prevFiles.map((f, idx) =>
                  idx === fileIndex ? { ...f, showSuccess: false } : f
                );
                return updatedFiles;
              });
            }, 450);
            return newFiles;
          }
        }
        return prevFiles;
      });
    }, 350);
    return intervalId;
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => {
        if (prevFiles.length + acceptedFiles.length > 5) {
          setErrorToast(true);
          setTimeout(() => {
            setErrorToast(false);
          }, 2000);
          return prevFiles;
        }

        const newFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          intervalId: null,
          showSuccess: true,
        }));

        const updatedFiles = [...prevFiles, ...newFiles];
        newFiles.forEach((_, index) => {
          const fileIndex = prevFiles.length + index;
          const intervalId = simulateProgress(fileIndex);
          updatedFiles[fileIndex].intervalId = intervalId;
        });

        setError(false);
        return updatedFiles;
      });
    },
    [files]
  );

  useEffect(() => {
    if (files.length > 4) {
      setError(true);
    } else {
      setError(false);
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png", ".jpg"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    noClick: error,
    noDrag: error,
    maxFiles: 5,
  });

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      if (prevFiles[index]) {
        const newFiles = [...prevFiles];
        clearInterval(newFiles[index].intervalId); // Clear interval
        URL.revokeObjectURL(newFiles[index].preview); // Clean up URL object
        newFiles.splice(index, 1);
        return newFiles;
      }
      return prevFiles; // Return previous state if file is not found
    });
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelectedFileIndex(index);
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (isCropMode == "crop") {
      handleModal();
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        if (selectedFileIndex !== null) {
          updatedFiles[selectedFileIndex].preview = croppedImageUrl;
        }
        return updatedFiles;
      });
    } else {
      setProfile(croppedImageUrl);
      setConfirmation(true);
    }
  };

  const isButtonDisabled = selectedFileIndex === null;

  const handleSelectImage = () => {
    setIsCropMode("update");
    setImageSrc(files[selectedFileIndex].preview);
    setIsModalOpen(true);
    handleModal();
  };

  return (
    <>
      <div
        className={`${styles.container} ${error && styles.notAllowed}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={error} />
        {isDragActive ? (
          <div className={`${styles.innerContent} ${styles.activeBorder}`}>
            <img src="/images/icons/thumbnail.svg" alt="thumbnail icon" />
            <h3>Drop the files here...</h3>
            <p> PNG, or JPG (Max 5MB)</p>
          </div>
        ) : (
          <div className={styles.innerContent}>
            {!error && (
              <img src="/images/icons/thumbnail.svg" alt="thumbnail icon" />
            )}
            <h3 className={`${error && styles.error}`}>
              {error
                ? "You've reached the image limit"
                : "Click or drag and drop to upload"}
            </h3>
            <p>
              {error
                ? "Remove one or more to upload more images."
                : "PNG, or JPG (Max 5MB)"}
            </p>
          </div>
        )}
      </div>

      <div className={`${files.length > 2 && styles.wrap}`}>
        {files.map((fileObj, index) => (
          <div key={index} className={styles.profileContainer}>
            <div className={styles.avatar}>
              <img src={fileObj.preview} alt="avatar" />
            </div>
            <div className={styles.details}>
              <div>
                <h3>{fileObj.file.name}</h3>
                <p>{(fileObj.file.size / 1024).toFixed(2)} KB</p>
                {fileObj.showSuccess ? (
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
              {fileObj.progress === 100 ? (
                fileObj.showSuccess ? (
                  <div className={styles.successUpload}>
                    <img src="/images/icons/greenCheck.svg" alt="Check" />
                    <h6>Upload success!</h6>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    {files.length > 1 && (
                      <>
                        <div
                          className={styles.cropImage}
                          onClick={() =>
                            showModal(fileObj.preview, index, "crop")
                          }
                        >
                          <img src="/images/icons/crop.svg" alt="Crop" />
                          <h6>Crop image</h6>
                        </div>
                        <div
                          className="dot"
                          style={{ background: "#525252" }}
                        />
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
                <ProgressBar progress={fileObj.progress} />
              )}
            </div>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className={styles.buttonWrap}>
          <PrimaryButton
            name={"Cancel"}
            variant={"secondary"}
            handleModal={handleModal}
          />
          <PrimaryButton
            name={"Select image"}
            variant={"primary"}
            disabled={isButtonDisabled}
            handleModal={handleSelectImage}
          />
        </div>
      )}
      <ProfileCrop
        isModalOpen={isModalOpen}
        imageSrc={imageSrc}
        setIsModalOpen={setIsModalOpen}
        onCropComplete={handleCropComplete}
        handleModal={handleModal}
        files={files}
        setConfirmation={setConfirmation}
      />
    </>
  );
};

export default UploadComponent;
