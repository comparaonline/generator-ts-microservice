require('ts-node/register');
const path = require('path');
const orm = require('config').orm;
const { username, password, database, host, dialect, port, type } = orm;
const url = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
module.exports = {
  url,
  type,
  synchronize: true,
  entities: [
    `${__dirname}/src/entities/{*.ts,**/!(__tests__)/*.ts}`
  ],
  migrations: [
    `${__dirname}/src/migrations/{*.ts,**/!(__tests__)/*.ts}`
  ],
  subscribers: [
    `${__dirname}/src/subscribers/{*.ts,**/!(__tests__)/*.ts}`
  ],
  cli: {
    entitiesDir: path.resolve('src', 'entities'),
    migrationsDir: path.resolve('src', 'migrations'),
    subscribersDir: path.resolve('src', 'subscribers')
  }
};
