import { Action } from 'event-streamer';
import { Ping } from '../events/ping';
import { Pong } from '../events/pong';

export class PingAction extends Action {
  private pongEmitter = this.emitter(Pong);
  async perform(input: Ping) {
    this.pongEmitter(new Pong({}));
  }
}
