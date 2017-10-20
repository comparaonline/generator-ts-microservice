import * as Hapi from 'hapi';
import * as hapiAlive from 'hapi-alive';

export default (host: string, port: number): Promise<void> => {
  const server = new Hapi.Server();
  server.connection({ host, port });
  server.register({
    register: hapiAlive,
    routes: {
      prefix: '/<%= microserviceName %>',
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
      healthCheck: (_server: Hapi.Server, callback: Function) => callback()
    }
  });
  return server.start()
    .then(() => console.log(`Listening at: ${server.info.uri}/<%= microserviceName %>`));
};
