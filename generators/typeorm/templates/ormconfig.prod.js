const path = require('path');
const orm = require('config').orm;
const { username, password, database, host, dialect, port, type } = orm;
const url = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
module.exports = {
  url,
  type,
  entities: [
    `${__dirname}/build/entities/{*.js,**/!(__tests__)/*.js}`
  ],
  migrations: [
    `${__dirname}/build/migrations/{*.js,**/!(__tests__)/*.js}`
  ],
  subscribers: [
    `${__dirname}/build/subscribers/{*.js,**/!(__tests__)/*.js}`
  ],
  cli: {
    entitiesDir: path.resolve('build', 'entities'),
    migrationsDir: path.resolve('build', 'migrations'),
    subscribersDir: path.resolve('build', 'subscribers')
  }
};
