const orm = require('config').orm;
const { username, password, database, host, dialect, port, type } = orm;
const url = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
module.exports = {
  url,
  type,
  entities: [
    `build/entities/{*.js,**/!(__tests__)/*.js}`
  ],
  migrations: [
    `build/migrations/{*.js,**/!(__tests__)/*.js}`
  ],
  subscribers: [
    `build/subscribers/{*.js,**/!(__tests__)/*.js}`
  ],
  cli: {
    entitiesDir: `build/entities`,
    migrationsDir: `build/migrations`,
    subscribersDir: `build/subscribers`
  }
};
