import path from 'path';
import multer from 'multer';
import isArray from 'lodash/isArray';

export type FileType = 'IMAGE' | 'VIDEO' | 'ALL';

const getFileType = (
  file: Express.Multer.File,
): Exclude<FileType, 'ALL'> | 'NONE' => {
  const ext = path.extname(file.originalname);
  const mimetype = file.mimetype;

  if (
    mimetype.includes('image/') ||
    ext === '.jpg' ||
    ext === '.png' ||
    ext === '.gif' ||
    ext === '.jpeg'
  ) {
    return 'IMAGE';
  } else if (
    ext === '.mp4' ||
    ext === '.avi' ||
    ext === '.wmv' ||
    ext === '.mov' ||
    mimetype.includes('video/')
  ) {
    return 'VIDEO';
  }

  return 'NONE';
};

const checkFileType = (
  file: Express.Multer.File,
  allowFileTypes: FileType | FileType[],
): boolean => {
  const fileType = getFileType(file);
  if (isArray(allowFileTypes)) {
    let isAllowed = false;
    allowFileTypes.forEach(allowFileType => {
      if (allowFileType === 'ALL') isAllowed = true;
      if (allowFileType === fileType) isAllowed = true;
    });

    return isAllowed;
  } else {
    if (allowFileTypes === 'ALL') return true;
    if (allowFileTypes === fileType) return true;
    return false;
  }
};

const createUploader = (
  allowFileTypes: FileType | FileType[],
  limits?: {
    fieldNameSize?: number | undefined;
    fieldSize?: number | undefined;
    fields?: number | undefined;
    fileSize?: number | undefined;
    files?: number | undefined;
    parts?: number | undefined;
    headerPairs?: number | undefined;
  },
) => {
  return multer({
    fileFilter: (_, file: Express.Multer.File, callback) => {
      const isAllowed = checkFileType(file, allowFileTypes);
      if (!isAllowed) {
        return callback(new Error('Not Allowed FileType'));
      } else {
        return callback(null, true);
      }
    },
    limits: {
      fileSize: 50000000,
      ...(limits || {}),
    },
  });
};

export const allUploader = createUploader('ALL');

export const imageUploader = createUploader('IMAGE');

export const videoUploader = createUploader('VIDEO');

export const imageAndVideoUploader = createUploader(['IMAGE', 'VIDEO']);

export default createUploader;
