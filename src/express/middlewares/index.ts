import { json, urlencoded } from "express";
import jsonwebtoken from "./jsonwebtoken";
import swagger from "./swagger";
import test from "./test";
import cors from "cors";
import pagination from "./pagination";
import createUploader, {
  allUploader,
  imageUploader,
  videoUploader,
  imageAndVideoUploader,
} from "./multer";

export {
  json,
  urlencoded,
  cors,
  jsonwebtoken,
  swagger,
  test,
  pagination,
  createUploader,
  allUploader,
  imageUploader,
  videoUploader,
  imageAndVideoUploader,
};
