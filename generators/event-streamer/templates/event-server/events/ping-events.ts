import { KafkaEvent } from 'event-streamer';
import * as config from 'config';

export class Ping extends KafkaEvent {
  build(args: {}) { }
}

export class Pong extends KafkaEvent {
  build(args: {}) { }
  toString() {
    return JSON.stringify({
      code: this.code,
      service: config.get('appName'),
      uptime: process.uptime()
    });
  }
}
