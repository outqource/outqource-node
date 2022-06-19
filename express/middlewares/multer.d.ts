import multer from 'multer';
export declare type FileType = 'IMAGE' | 'VIDEO' | 'ALL';
declare const createUploader: (
  allowFileTypes: FileType | FileType[],
  limits?:
    | {
        fieldNameSize?: number | undefined;
        fieldSize?: number | undefined;
        fields?: number | undefined;
        fileSize?: number | undefined;
        files?: number | undefined;
        parts?: number | undefined;
        headerPairs?: number | undefined;
      }
    | undefined,
) => multer.Multer;
export declare const allUploader: multer.Multer;
export declare const imageUploader: multer.Multer;
export declare const videoUploader: multer.Multer;
export declare const imageAndVideoUploader: multer.Multer;
export default createUploader;
