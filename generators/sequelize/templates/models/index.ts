import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import * as fullConfig from 'config';

type DbConfig = { database: string, username: string, password: string };

const config: DbConfig = fullConfig.get('sequelize');
const basename = path.basename(__filename);
const db = {};
const { database, username, password } = config;

const sequelize = new Sequelize(database, username, password, config);

const validFiles = file =>
  (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');

fs.readdirSync(__dirname)
  .filter(validFiles)
  .map(file => sequelize.import(path.join(__dirname, file)))
  .forEach(model => db[model['name']] = model);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

export default db;
