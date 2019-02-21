import { expect } from 'chai';
import testResolvers from './../test';

describe('Graphql test', () => {
  it('return message', async () => {
    const message = 'message';
    expect(testResolvers.test(null, { message })).to.exist;
  });
});
