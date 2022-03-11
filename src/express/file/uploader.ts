import multer from "multer";
import { FileType, getFileType } from "./dataType";

export const createUploader = (allowFileTypes: FileType | FileType[]) => {
  return multer({
    fileFilter: (_, file: Express.Multer.File, callback) => {
      if (allowFileTypes === "ALL") {
        callback(null, true);
      } else {
        const fileType = getFileType(file);
        if (Array.isArray(allowFileTypes)) {
          let isAllowed = false;

          allowFileTypes.forEach((allowFileType: FileType) => {
            if (allowFileType === fileType) {
              isAllowed = true;
            }
          });

          if (!isAllowed) {
            return callback(
              new Error(`Only ${allowFileTypes.join(",")} are allowed`)
            );
          } else {
            callback(null, true);
          }
        } else {
          if (allowFileTypes === fileType) {
            callback(null, true);
          } else {
            return callback(new Error(`Only ${allowFileTypes} are allowed`));
          }
        }
      }
    },
  });
};

export const allUploader = createUploader("ALL");

export const imageUploader = createUploader("IMAGE");

export const videoUploader = createUploader("VIDEO");

export const imageAndVideoUploader = createUploader(["IMAGE", "VIDEO"]);
