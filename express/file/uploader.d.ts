import multer from "multer";
import { FileType } from "./dataType";
export declare const createUploader: (allowFileTypes: FileType | FileType[]) => multer.Multer;
export declare const allUploader: multer.Multer;
export declare const imageUploader: multer.Multer;
export declare const videoUploader: multer.Multer;
export declare const imageAndVideoUploader: multer.Multer;
