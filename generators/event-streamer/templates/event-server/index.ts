import { KafkaServer } from 'event-streamer';
import * as config from 'config';
import { router } from './router';

export const server = new KafkaServer(router, config.get('kafka'));

const start = () => Promise.resolve(server.start())
  .then(() => 'KafkaServer started');

const stop = () => new Promise((resolve, reject) => server.stop((err) => {
  if (err) {
    reject(err);
  } else {
    resolve('KafkaServer stopped');
  }
}));

export default { start, stop };
