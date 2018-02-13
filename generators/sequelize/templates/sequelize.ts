import * as path from 'path';
import * as config from 'config';
import { Sequelize } from 'sequelize-typescript';

const extend = (...objs) => Object.assign({}, ...objs);

export const sequelize = new Sequelize(extend(
  config.get('sequelize'),
  { modelPaths: [path.join(__dirname, '../models')] }
));
