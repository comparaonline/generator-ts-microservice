/* istanbul ignore file */
import { KafkaServer, KafkaInputEvent } from '@comparaonline/event-streamer';
import * as config from 'config';
import * as Raven from 'raven';
import { router } from './router';
import { application } from '../application';
import { logger } from '../initialization/winston';

export const kafkaServer = new KafkaServer(router, config.get('kafka'), {
  debug: (msg: string) => logger.debug(msg),
  info: (msg: string) => logger.info(msg),
  error: (msg: string) => logger.error(msg)
});

application.onStart(() => {
  kafkaServer.start();
  kafkaServer.on('error', (error, event?: KafkaInputEvent) => {
    console.error(error);
    Raven.captureException(error, { extra: { event } }, () => {
      application.shutdown();
    });
  });
});

application.onShutdown(() => kafkaServer.stop());
