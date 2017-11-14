import * as express from 'express';
import * as logger from 'morgan';
import * as config from 'config';
import routes from './routes';
import './initialization';

const app = express();
app.use(logger(config.get('server.logFormat')));
app.use(config.get('server.baseUrl'), routes);
app.listen(config.get('server.port'), () => console.log(`<%= microserviceName %> is up!`));
