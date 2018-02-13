import { sequelize } from '../initialization/sequelize';

const models = Object.keys(sequelize.models)
  .map(key => sequelize.models[key]);

beforeEach(async () => Promise.all(models.map(model =>
  model.truncate({ cascade: true })
)));
after(() => sequelize.close());
