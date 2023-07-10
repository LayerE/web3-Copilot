import { Camera, Upload } from "react-feather";
import styled from "styled-components";
import Row from "../common/Row";
import { TEXT } from "@/theme/texts";

const ImageUploader = ({
  onChange,
  src,
}: {
  onChange: (e: any) => void;
  src: string;
}) => {
  return (
    <ImgUploadCtr className="cardBg">
      <label className="_custom-file-upload">
        <div className="_img-wrap _img-upload">
          {src && src !== "null" && src !== "undefined" ? (
            <img src={src} alt="" />
          ) : (
            <Camera size="1rem" />
          )}
        </div>
        <input
          id="photo-upload"
          type="file"
          onChange={onChange}
          accept="image/x-png,image/gif,image/jpeg,image/webp"
        />
        <Row gap=".5rem">
          <TEXT.SmallHeader size=".8rem">Upload NFT Image</TEXT.SmallHeader>
        </Row>
      </label>
    </ImgUploadCtr>
  );
};

const ImgUploadCtr = styled.div`
  gap: 1rem;
  width: fit-content;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ._custom-file-upload {
    border-radius: 0.25rem;
    display: flex;
    position: relative;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    border: 1px solid ${(props) => props.theme.secondary};
    padding-right: 0.5rem;
  }
  ._img-wrap {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-right: 1px solid ${(props) => props.theme.secondary};
    overflow: hidden;
    display: grid;
    place-items: center;
    border-radius: 0.25rem;

    .img_placeholder {
      background: var(--btn-color-x02);
    }
    img {
      object-position: center;
      object-fit: cover;
      height: 100%;
      width: 100%;
      border-radius: var(--border-radius);
    }
  }
`;

export default ImageUploader;
