import * as config from 'config';
import { ApolloServer, gql } from 'apollo-server-express';
import { app } from '../web-server';
import schema from './schema';
import resolvers from './resolvers';

const path = `${config.get('server.baseUrl')}/graphql`;

const typeDefs = gql(schema.join());
const serverOptions = {
  typeDefs,
  resolvers,
  subscriptions: { path },
  formatError: (error: any) => {
    console.error(error, error.extensions.exception.stacktrace);
    return error;
  }
};

const server = new ApolloServer(serverOptions);

server.applyMiddleware({ app, path });
