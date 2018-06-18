import { Router } from '@comparaonline/event-streamer';
import { Ping } from './events/ping-events';
import { PingAction } from './actions/ping-action';

export const router = new Router();
router.add(Ping, PingAction);
