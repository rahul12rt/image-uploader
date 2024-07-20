import { Modal } from "antd";
import React, { useState, useCallback, useRef } from "react";
import Cropper, {
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
  files,
  setConfirmation,
}) => {
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
    if (files.length > 1) {
      handleModal();
    } else {
      setConfirmation(true);
    }
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
    onCropComplete(dataUrl);

    setIsModalOpen(false);
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
                src={imageSrc}
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
