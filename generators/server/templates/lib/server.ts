import * as Hapi from 'hapi';
import * as hapiAlive from 'hapi-alive';

const PREFIX = '<%= microserviceName %>'

export default <T>(host: string, port: number,
  plugins: Array<Hapi.PluginRegistrationObject<T>> = []) => {
  const server = new Hapi.Server();
  server.connection({ host, port });
  server.register({
    register: hapiAlive,
    routes: {
      prefix: `/${PREFIX}`
    },
    options: {
      path: '/healthcheck',
      tags: ['health', 'monitor'],
      responses: {
        healthy: {
          message: 'Everything OK!'
        },
        unhealthy: {
          statusCode: 400
        }
      },
      healthCheck: (server: Hapi.Server, callback: Function) => callback()
    }
  });
  plugins.forEach(plugin => server.register(<any>{
    register: plugin,
    routes: {
      prefix: `/${PREFIX}`
    }
  }));
  return server.start()
    .then(() => server.info ? server.info.uri : '')
    .then(uri => console.log(`Listening at: ${uri}/${PREFIX}`));
};
