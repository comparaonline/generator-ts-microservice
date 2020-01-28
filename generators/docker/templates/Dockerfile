FROM node:12.13.1-alpine AS base
WORKDIR /code
EXPOSE 4000
<%= [...new Set(base)].join('\n') %>

FROM base AS build
RUN apk add --no-cache <%= [...new Set(dependencies)].join(' \\\n  ') %>
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY tsconfig.json <%= [...new Set(files)].join(' ') %> ./
COPY config/ ./config
<%= [...new Set(folders)].map(f => `COPY ${f}/ ./${f}`).join('\n') %>
COPY src/ ./src
RUN yarn compile

FROM build as clean
RUN yarn install --production
RUN rm -rf ./src

FROM base AS production
LABEL Name="ComparaOnline <%= microserviceName %>" Version="2.0"
ARG ENVIRONMENT="production"
ENV NODE_ENV=${ENVIRONMENT}
COPY --from=clean /code ./
<%= [...new Set(lastCopies)].map(([a, b]) => `COPY ${a} ./${b}`).join('\n') %>
CMD ["yarn", "start"]
