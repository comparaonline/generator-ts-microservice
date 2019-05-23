import { Action } from '@comparaonline/event-streamer';
import { Pong } from '../events/ping-events';

export class PingAction extends Action {
  async perform() {
    await this.emit(new Pong());
  }
}
