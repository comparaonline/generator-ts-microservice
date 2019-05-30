/* istanbul ignore file */
import * as Raven from 'raven';
import * as config from 'config';

const enabledFor = (env: string) => ['production', 'staging'].includes(env);
const fail = (message: string) => { throw new Error(message); };
const activateRaven = () =>
  enabledFor(config.util.getEnv('NODE_CONFIG_ENV') || fail('NODE_ENV should be set'));

Raven.config(activateRaven() && config.get('raven.dsn'), {
  environment: config.util.getEnv('NODE_CONFIG_ENV'),
  autoBreadcrumbs: true,
  captureUnhandledRejections: true
}).install();
