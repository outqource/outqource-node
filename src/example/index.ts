import path from "path";
import { InitApp } from "../express";

import controllers from "./controllers";

const jwtUserCallback = async (accessToken: string) => {
  return {
    id: "1",
  };
};

const init = new InitApp({
  controllers,
  openAPI: { path: path.join(__dirname, "./config.json") },
});

init.init().then(() => {
  init.middlewares({ jwtUserCallback });
  init.routers();
  init.app.listen(8000);
});
