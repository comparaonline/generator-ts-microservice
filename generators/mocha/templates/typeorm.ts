import { getConnection } from 'typeorm';
import { connection } from '../initialization/typeorm';

const clearDb = async () => {
  try{
    const conn = getConnection();
    const entities = conn.entityMetadatas;
    for(const entity of entities) {
      const repository = await conn.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  } catch(error) {
    console.error(error);
  }
};

beforeAll(async () => await connection());

beforeEach(async () => {
  await clearDb();
});

afterAll(async () => await getConnection().close());

