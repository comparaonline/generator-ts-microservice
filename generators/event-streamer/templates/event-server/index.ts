import { KafkaServer } from '@comparaonline/event-streamer';
import * as config from 'config';
import * as Raven from 'raven';
import { router } from './router';
import { application } from '../application';

export const kafkaServer = new KafkaServer(router, config.get('kafka'));

application.onStart(() => {
  kafkaServer.start();
  kafkaServer.on('error', (error) => {
    console.error(error);
    Raven.captureException(error);
    application.shutdown();
  });
});

application.onShutdown(() => kafkaServer.stop());
