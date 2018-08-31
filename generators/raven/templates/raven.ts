import * as Raven from 'raven';
import * as config from 'config';

const enabledFor = env => ['production', 'staging'].includes(env);
const fail = message => { throw new Error(message); }
const activateRaven = () =>
  enabledFor(config.util.getEnv('NODE_CONFIG_ENV') || fail('NODE_ENV should be set'));

Raven.config(activateRaven() && config.get('raven.dsn'), {
  release: config.get('raven.release'),
  environment: config.util.getEnv('NODE_CONFIG_ENV'),
  autoBreadcrumbs: true,
  captureUnhandledRejections: true
}).install();

