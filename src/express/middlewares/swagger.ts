import swaggerUI from "swagger-ui-express";

const swagger = (path: string) => {
  const document = require(path);
  return [swaggerUI.serve, swaggerUI.setup(document)];
};

export default swagger;
