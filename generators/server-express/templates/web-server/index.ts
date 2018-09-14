import * as express from 'express';
import * as logger from 'morgan';
import * as config from 'config';
import * as Raven from 'raven';
import routes from './routes';
import { application } from '../application';
import { Server } from 'http';

export const app = express();

if (config.util.getEnv('NODE_CONFIG_ENV') !== 'test') {
  app.use(Raven.requestHandler());
  app.use(Raven.errorHandler());
  app.use(
    logger(
      config.get('server.logFormat'),
      { skip: req => req.baseUrl.includes('healthcheck') }
    )
  );
}

app.use(config.get('server.baseUrl'), routes);

export let server: Server;

const start = () => new Promise((resolve, reject) => {
  server = app.listen(config.get('server.port'), (error: Error) => {
    if (error) {
      reject(error);
    } else {
      resolve('Express Server started');
    }
  });
});
const stop = () => new Promise((resolve, reject) => {
  server.close((error: Error) => {
    if (error) {
      reject(error);
    } else {
      resolve('Express Server stopped');
    }
  });
});

application.onStart(() => {
  start()
    .then(message => console.log(message))
    .then(() => console.log(`${config.get('appName')} started!`))
    .catch((error: Error) => {
      console.error(error);
      Raven.captureException(error);
      application.shutdown();
    });
});
application.onShutdown(() => stop());

export { start, stop };
