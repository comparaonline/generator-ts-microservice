/* istanbul ignore file */
import * as path from 'path';
import * as config from 'config';
import { Sequelize } from 'sequelize-typescript';
import { application } from '../application';

export const sequelize = new Sequelize({
  ...config.get('sequelize'),
  modelPaths: [
    path.join(__dirname, '../models/**/*.model.js'),
    path.join(__dirname, '../models/**/*.model.ts')
  ]
});

application.onShutdown(() => sequelize.connectionManager.close());
