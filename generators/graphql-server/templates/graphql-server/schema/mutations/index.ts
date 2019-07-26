/* istanbul ignore file */
import test from './test';

const queries:string[] = [];

const allQueries: string = queries.concat(
  test
).join();

export default `
  type Mutation {
    ${allQueries}
  }
`;
