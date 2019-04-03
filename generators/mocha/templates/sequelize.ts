import { sequelize } from '../initialization/sequelize';

const models = Object.values(sequelize._);

beforeEach(async () => Promise.all(
  Object.values(models).map((model: any) =>
    model.truncate({ cascade: true })
)));
after(() => sequelize.connectionManager.close());
