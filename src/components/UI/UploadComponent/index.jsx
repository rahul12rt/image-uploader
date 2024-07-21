import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./index.module.css";
import PrimaryButton from "../Button/primary";
import ProfileCrop from "../Modal";
import InfoCard from "../Card/infoCard";

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

  const simulateProgress = useCallback((fileIndex) => {
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
            }, 1000);
            return newFiles;
          }
        }
        return prevFiles;
      });
    }, 350);
    return intervalId;
  }, []);

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
    [setErrorToast, setFiles, simulateProgress]
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
      return prevFiles;
    });
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelectedFileIndex(index);
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (isCropMode === "crop") {
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
    }
  };

  const isButtonDisabled = selectedFileIndex === null;

  const handleSelectImage = () => {
    setIsCropMode("update");
    setImageSrc(files[selectedFileIndex]);
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

      <InfoCard
        files={files}
        handleRemoveFile={handleRemoveFile}
        handleCheckboxChange={handleCheckboxChange}
        showModal={showModal}
        selectedFileIndex={selectedFileIndex}
      />

      {files?.length > 0 && (
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
        isCropMode={isCropMode}
        setConfirmation={setConfirmation}
      />
    </>
  );
};

export default UploadComponent;
