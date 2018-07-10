import { Action } from '@comparaonline/event-streamer';
import { Ping, Pong } from '../events/ping-events';

export class PingAction extends Action {
  async perform(input: Ping) {
    this.emit(new Pong());
  }
}
