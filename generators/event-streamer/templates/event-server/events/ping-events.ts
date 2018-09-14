import { KafkaInputEvent, KafkaOutputEvent } from '@comparaonline/event-streamer';
import * as config from 'config';

export class Ping extends KafkaInputEvent {
  build() { }
}

export class Pong extends KafkaOutputEvent {
  encode() {
    return {
      service: config.get('appName'),
      uptime: process.uptime()
    };
  }
}
