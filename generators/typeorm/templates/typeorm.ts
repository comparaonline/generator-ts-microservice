import * as config from 'config';
import { createConnection, getConnection } from 'typeorm';
import { application } from '../application';

const orm = config.get<object>('orm');
export const connection = createConnection({
  ...orm,
  type: orm['type'],
  entities: [
    'src/entities/*.ts',
    'build/entities/*.js'
  ],
  migrations: [
    'src/migrations/*.ts',
    'build/migrations/*.js'
  ]
});
application.onShutdown(() => getConnection().close());
