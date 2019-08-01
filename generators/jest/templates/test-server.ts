import { TestServer } from '@comparaonline/event-streamer';
import { router } from '../event-server/router';

export const testServer = new TestServer(router);

beforeEach(() => {
  testServer.cleanEmitted();
});
