import {
  ExpressController,
  ControllerAPI,
  createPrismaController,
  CreatePrismaControllerOptions,
} from "../../express";

export const getPostAPI: ControllerAPI = {
  tags: ["Post"],
  summary: "포스트 한개 가져오기",
  method: "GET",
  path: "/posts/:id",
  param: [{ key: "id", type: "number" }],
};

export const getPost: ExpressController = async (req, res, next) => {
  res.status(200).json();
};
