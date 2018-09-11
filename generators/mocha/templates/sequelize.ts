import { sequelize } from '../initialization/sequelize';

const models = Object.values(sequelize.models);

beforeEach(async () => Promise.all(models.map(model =>
  model.truncate({ cascade: true })
)));
after(() => sequelize.close());
