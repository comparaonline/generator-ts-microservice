import testResolvers from '../test';

describe('Graphql test', () => {
  it('returns the same message', () => {
    const message = 'message';
    return expect(testResolvers.test(null, { message })).toEqual(message);
  });
});
