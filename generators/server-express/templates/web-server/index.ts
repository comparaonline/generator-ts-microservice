import * as express from 'express';
import * as logger from 'morgan';
import * as config from 'config';
import routes from './routes';

export const app = express();
app.use(logger(config.get('server.logFormat')));
app.use(config.get('server.baseUrl'), routes);

export let server;

const start = () => new Promise((resolve, reject) => {
  server = app.listen(config.get('server.port'), (error) => {
    if (error) {
      reject(error);
    } else {
      resolve('Express Server started');
    }
  });
});
const stop = () => new Promise((resolve, reject) => {
  server.close((err) => {
    if (err) {
      reject(err);
    } else {
      resolve('Express Server stopped');
    }
  });
});

export default { start, stop };
