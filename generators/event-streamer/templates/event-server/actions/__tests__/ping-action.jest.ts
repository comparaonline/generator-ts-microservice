import { PingAction } from '../ping-action';
import { TestServer } from 'event-streamer';
import { router } from '../../router';
import { Pong } from '../../events/ping-events';

describe('PingAction', () => {
  it('returns consumer data when pinged', async () => {
    const server = new TestServer(router);
    server.inputEvent({ code: 'Ping' });
    const published = await server.publishedEvents();
    expect(published).toHaveLength(1);
    expect(published[0]).toBeInstanceOf(Pong);
    const publishedData = JSON.parse(published[0].toString());
    expect(publishedData).toHaveProperty('code');
    expect(publishedData).toHaveProperty('service');
    expect(publishedData).toHaveProperty('uptime');
  });
});
