import { Modal } from "antd";
import React, { useState, useCallback, useRef } from "react";
import {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  ReactCrop,
} from "react-image-crop";
import styles from "./index.module.css";
import PrimaryButton from "../Button/primary";
import setCanvasPreview from "../../utils/setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ProfileCrop = ({
  isModalOpen,
  imageSrc,
  setIsModalOpen,
  onCropComplete,
  handleModal,
  isCropMode,
  setConfirmation,
}) => {
  const [loader, setLoader] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }, []);

  const handleSave = async () => {
    setCanvasPreview(
      imgRef?.current, // HTMLImageElement
      previewCanvasRef?.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef?.current?.width, imgRef?.current?.height)
    );
    const dataUrl = previewCanvasRef?.current?.toDataURL();

    if (isCropMode === "update") {
      const payload = {
        name: imageSrc?.file?.name,
        preview: imageSrc?.preview,
        size: imageSrc?.file?.size,
        type: imageSrc?.file?.type,
      };
      setLoader(true);
      try {
        const response = await fetch(
          "https://image-uploader-backend-r2pm.onrender.com/api/profile/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        if (result?.sucess === true) {
          onCropComplete(dataUrl);
          setIsModalOpen(false);
          setConfirmation(
            <h6 style={{ color: "#15803d" }}>
              <span>Success</span> Changes saved successfully
            </h6>
          );
          setTimeout(() => {
            setConfirmation("");
          }, 2000);
          setLoader(false);
        }
      } catch (error) {
        setIsModalOpen(false);
        setLoader(false);
        setConfirmation(
          <h6 style={{ color: "#dc2626" }}>
            <span>Error</span> Upload failed. Please retry or contact us if you
            believe this is a bug.
          </h6>
        );
        setTimeout(() => {
          setConfirmation("");
        }, 4000);
      }
    } else {
      onCropComplete(dataUrl);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    handleModal();
    setIsModalOpen(false);
  };

  return (
    <div className={styles.profileCropContrainer}>
      <Modal
        title="Crop your picture"
        open={isModalOpen}
        width={300}
        footer={null}
        onCancel={handleCancel}
      >
        <div className={styles.cropperContainer}>
          {imageSrc && (
            <ReactCrop
              crop={crop}
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              onChange={(pixelCrop) => setCrop(pixelCrop)}
              minWidth={MIN_DIMENSION}
            >
              <img
                src={imageSrc?.preview}
                onLoad={onImageLoad}
                alt="Crop Preview"
                ref={imgRef}
              />
            </ReactCrop>
          )}
        </div>
        <div className={styles.buttonWrap}>
          <PrimaryButton
            name={"Cancel"}
            variant={"secondary"}
            handleModal={handleCancel}
          />
          <PrimaryButton
            name={"Confirm"}
            variant={"primary"}
            handleModal={handleSave}
            loader={loader}
          />
        </div>
        {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "none",
              border: "1px solid black",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProfileCrop;
