import { KafkaServer } from '@comparaonline/event-streamer';
import * as config from 'config';
import { router } from './router';

export const kafkaServer = new KafkaServer(router, config.get('kafka'));
