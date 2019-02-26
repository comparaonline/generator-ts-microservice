import tracer from 'dd-trace';
import * as config from 'config';

if (config.util.getEnv('DD_AGENT_HOST')) {
  tracer.init({
    service: config.get('appName'),
    hostname: config.util.getEnv('DD_AGENT_HOST'),
    env: config.util.getEnv('NODE_CONFIG_ENV'),
    tags: {
      environment: config.util.getEnv('NODE_CONFIG_ENV'),
      project: config.get('datadog.projectName'),
      serviceName: config.get('appName')
    }
  });
}
