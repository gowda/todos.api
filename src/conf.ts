import nconf from "nconf";

nconf.argv().env({separator: '_', lowerCase: true});

export const env = nconf.get('todos:env') || nconf.env().get('NODE_ENV') || 'development';

export const logdir = nconf.get('todos:logdir') || 'logs';

export const host = nconf.get('todos:host') || 'localhost';
export const port = nconf.get('todos:port') || 42000;
