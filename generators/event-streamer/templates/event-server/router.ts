import { Router } from 'event-streamer';
import { Ping } from './events/ping';
import { PingAction } from './actions/ping-action';

export const router = new Router();
router.add(Ping, PingAction);
