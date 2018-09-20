import * as config from 'config';
import * as Raven from 'raven';

class Application {
  private startHandlers: Function[] = [];
  private shutdownHandlers: Function[] = [];

  onStart(handler: Function) {
    this.startHandlers.push(handler);
  }

  onShutdown(handler: Function) {
    this.shutdownHandlers.push(handler);
  }

  start() {
    // quit on ctrl-c when running docker in terminal
    process.on('SIGINT', () => {
      console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
      this.shutdown();
    });
    // quit properly on docker stop
    process.on('SIGTERM', () => {
      console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
      this.shutdown();
    });
    console.log(`Starting ${config.get('appName')}`);
    this.startHandlers.forEach(handler => handler());
  }

  shutdown() {
    console.log(`Shutting down ${config.get('appName')}`);
    Promise.all(this.shutdownHandlers)
      .then(results => results.forEach(message => console.log(message)))
      .then(() => console.log(`${config.get('appName')} stopped!`))
      .catch((error: Error) => {
        console.error(error);
        Raven.captureException(error);
        process.exitCode = 1;
      })
      .then(() => process.exit());
  }
}

export const application = new Application();
