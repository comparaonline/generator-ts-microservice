import TraceProxy, { TracerOptions } from 'dd-trace';
import * as config from 'config';
import * as opentracing from 'opentracing';

const baseConfig: TracerOptions = {
  service: config.get('appName'),
  env: process.env.NODE_CONFIG_ENV,
  logInjection: true,
  tags: {
    environment: process.env.NODE_CONFIG_ENV,
    project: config.get('appName'),
    serviceName: config.get('appName')
  }
};

const getDatadogConfig = (): TracerOptions => {
  if (!process.env.DD_AGENT_HOST) {
    return {
      ...baseConfig,
      debug: false,
      hostname: config.has('datadog.host') ? config.get('datadog.host') : 'datadog'
    };
  }
  return {
    ...baseConfig,
    hostname: process.env.DD_AGENT_HOST
  };
};

export const tracer = TraceProxy.init(getDatadogConfig());

opentracing.initGlobalTracer(tracer);
