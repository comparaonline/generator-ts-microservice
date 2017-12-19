import * as express from 'express';
import * as logger from 'morgan';
import * as config from 'config';
import routes from './routes';
import './initialization';

const app = express();
app.use(logger(config.get('server.logFormat')));
app.use(config.get('server.baseUrl'), routes);

const server = app.listen(
  config.get('server.port'), () => console.log(`<%= microserviceName %> is up!`)
);

// Graceful shutdown. Based on:
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
  console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', () => {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
  shutdown();
});

function shutdown() {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}
