import express from 'express';
import initApp from './app';
import jwtUserCallback from './middlewares/jwtUserCallback';

const PORT = 8000;

(async () => {
  await initApp.init();
  console.log('⭐️ OpenAPI created!');
  initApp.app.use(express.json({ limit: '50mb' }));
  initApp.app.use(express.urlencoded({ limit: '50mb' }));
  initApp.middlewares([], { jwtUserCallback });
  initApp.routers({
    globalOptions: {
      html: '<h1>OutQource Node</h1>',
      status: 200,
    },
  });

  initApp.app.listen(PORT, () => {
    console.log(`🚀 Sever Listening on ${PORT}...`);
  });
})();
