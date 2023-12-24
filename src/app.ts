import express from 'express';
import PagePool from './browser/pagepool';
import apiRouter from './routers/api';
import indexRouter from './routers/index';

const app = express();
const { PAGE_COUNT = '5', PORT = '8000' } = process.env;

(async () => {
  console.log('connecting to puppeteer...');
  console.log('connected');
  console.log('initializing pages...');

  try {
    await new PagePool(parseInt(PAGE_COUNT, 10)).init();
  } catch (e) {
    console.log('Failed to initialize pages');
    console.error(e);
    process.exit(1);
  }

  console.log('ready');

  app.use('/', indexRouter);
  app.use('/api', apiRouter);

  try {
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

export default app;