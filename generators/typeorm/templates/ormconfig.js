require('ts-node/register');
const orm = require('config').orm;
const { username, password, database, host, dialect, port, type } = orm;
const url = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
module.exports = {
  url,
  type,
  entities: [
    `src/entities/{*.ts,**/!(__tests__)/*.ts}`
  ],
  migrations: [
    `src/migrations/{*.ts,**/!(__tests__)/*.ts}`
  ],
  subscribers: [
    `src/subscribers/{*.ts,**/!(__tests__)/*.ts}`
  ],
  cli: {
    entitiesDir: `src/entities`,
    migrationsDir: `src/migrations`,
    subscribersDir: `src/subscribers`
  }
};
