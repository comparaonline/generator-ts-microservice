import { expect } from 'chai';
import testResolvers from '../test';

describe('Graphql test', () => {
  it('returns the same message', () => {
    const message = 'message';
    expect(testResolvers.test(null, { message })).to.equal(message);
  });
});
