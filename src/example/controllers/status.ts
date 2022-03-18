import { ExpressController, ControllerAPI } from "../../express";

export const getStatusAPI: ControllerAPI = {
  tags: ["Test"],
  method: "GET",
  path: "/test",
  responses: [
    { status: 200, example: { foo: "bar" } },
    { status: 400, example: { hello: "world" } },
  ],
};

export const getStatus: ExpressController = async (req, res, next) => {
  try {
    throw { status: 400, message: "FOO:BAR", data: "hello" };
  } catch (error) {
    next(error);
  }
};
