import * as config from 'config';
import './initialization';

interface Server {
  start(): Promise<string>;
  stop(): Promise<string>;
}

const servers: Server[] = [
  <%- servers %>
];

Promise.all(servers.map(server => server.start()))
  .then(results => results.forEach(message => console.log(message)))
  .then(() => console.log(`${config.get('appName')} started!`))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

// Graceful shutdown. Based on:
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
function shutdown() {
  console.log(`Shutting down ${config.get('appName')}`);
  Promise.all(servers.map(server => server.stop()))
    .then(results => results.forEach(message => console.log()))
    .then(() => console.log(`${config.get('appName')} stopped!`))
    .catch((error: Error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .then(() => process.exit());
}
// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
  console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
  shutdown();
});
// quit properly on docker stop
process.on('SIGTERM', () => {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
  shutdown();
});
