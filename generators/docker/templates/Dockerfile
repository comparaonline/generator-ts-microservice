FROM mhart/alpine-node:8
LABEL Name="ComparaOnline <%= microserviceName %>" Version="1.0"

ARG ENVIRONMENT="production"

ENV NODE_ENV=${ENVIRONMENT}
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /code

COPY package.json yarn.lock ./
RUN yarn install

COPY build /code/build

CMD ["yarn", "start"]

EXPOSE 3000
