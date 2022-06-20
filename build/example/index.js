'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const app_1 = __importDefault(require('./app'));
const jwtUserCallback_1 = __importDefault(require('./middlewares/jwtUserCallback'));
const PORT = 8000;
(async () => {
  await app_1.default.init();
  console.log('⭐️ OpenAPI created!');
  app_1.default.app.use(express_1.default.json({ limit: '50mb' }));
  app_1.default.app.use(express_1.default.urlencoded({ limit: '50mb' }));
  app_1.default.middlewares([], { jwtUserCallback: jwtUserCallback_1.default });
  app_1.default.routers({
    globalOptions: {
      html: '<h1>OutQource Node</h1>',
      status: 200,
    },
  });
  app_1.default.app.listen(PORT, () => {
    console.log(`🚀 Sever Listening on ${PORT}...`);
  });
})();
