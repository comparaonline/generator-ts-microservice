import { expect } from 'chai';
import { TestServer } from 'event-streamer';
import { router } from '../../router';
import { Pong } from '../../events/ping-events';

describe('PingAction', () => {
  it('returns consumer data when pinged', async () => {
    const server = new TestServer(router);
    server.inputEvent({ code: 'Ping' });
    const published = await server.publishedEvents();
    expect(published).to.have.length(1);
    expect(published[0]).to.be.instanceof(Pong);
    const publishedData = JSON.parse(published[0].toString());
    expect(publishedData).to.have.property('code');
    expect(publishedData).to.have.property('service');
    expect(publishedData).to.have.property('uptime');
  });
});
