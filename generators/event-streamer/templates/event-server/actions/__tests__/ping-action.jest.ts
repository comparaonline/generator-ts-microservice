import { testServer } from '../../../test-helpers/test-server';
import { Pong } from '../../events/ping-events';
jest.mock('../../../event-server');

describe('PingAction', () => {
  it('returns consumer data when pinged', async () => {
    await testServer.input({ code: 'Ping' });
    const published = testServer.emitted();
    expect(published).toHaveLength(1);
    expect(published[0]).toBeInstanceOf(Pong);
    const publishedData = JSON.parse(published[0].toString());
    expect(publishedData).toHaveProperty('code');
    expect(publishedData).toHaveProperty('service');
    expect(publishedData).toHaveProperty('uptime');
  });
});
