// 本番で開くファイル
const swaggerUi = require('swagger-ui-express');

const app = require('./routes/app.js');
const { connectDB } = require('./utils/db.js');
const { port } = require('./config.js'); // 環境変数
const specs = require('./utils/swaggerSpecs.js'); // 連想配列の中身だけ取り出す

/* eslint-disable no-console */
(async () => {
  await connectDB(); // DBに接続

  specs.forEach(({ version, spec }) => {
    const docsPath = `/api-docs/${version}`; // ドキュメントのURL決める
    app.use(docsPath, swaggerUi.serve, (...args) => {
      // 最後にsetupしたspecが返されるっぽいから複数ページ管理するにはこうするしかないかも
      swaggerUi.setup(spec)(...args);
    });
    console.log(`API ${version} docs path: ${docsPath}`); // 接続できるよ、ってのを書いている
  });

  app.listen(port, () => console.log(`Server is running on port ${port}`)); // ポート番号を表示させる
})();
