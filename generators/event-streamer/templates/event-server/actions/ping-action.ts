import { Action } from '@comparaonline/event-streamer';
import { Ping, Pong } from '../events/ping-events';

export class PingAction extends Action {
  private pongEmitter = this.emitter(Pong);
  async perform(input: Ping) {
    this.pongEmitter(new Pong({}));
  }
}
