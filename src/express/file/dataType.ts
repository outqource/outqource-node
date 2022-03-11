export type FileType = "IMAGE" | "VIDEO" | "ALL" | "NONE";

export const getFileType = (file: any): "IMAGE" | "VIDEO" | "NONE" => {
  if (!file?.mimetype) {
    return "NONE";
  }

  if (file.mimetype.indexOf("image") > -1) {
    return "IMAGE";
  } else if (file.mimetype.indexOf("video") > -1) {
    return "VIDEO";
  } else {
    return "NONE";
  }
};
