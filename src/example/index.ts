import path from "path";
import {
  InitApp,
  Request,
  Response,
  NextFunction,
  ControllerAPI,
} from "../express";

const getStatusAPI: ControllerAPI = {
  tags: ["Test"],
  method: "GET",
  path: "/test",
  responses: [
    { status: 200, example: { foo: "bar" } },
    { status: 400, example: { hello: "world" } },
  ],
};

const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw { status: 400, message: "FOO:BAR", data: "hello" };
  } catch (error) {
    next(error);
  }
};

const jwtUserCallback = async (accessToken: string) => {
  return {
    id: "1",
  };
};

const controllers = { getStatus, getStatusAPI };

const init = new InitApp({
  controllers,
  openAPI: { path: path.join(__dirname, "./config.json") },
});

init.init().then(() => {
  init.middlewares({ jwtUserCallback });
  init.routers();
  init.app.listen(8000);
});
