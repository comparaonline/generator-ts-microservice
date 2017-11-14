FROM mhart/alpine-node:8
LABEL Name="ComparaOnline <%= microserviceName %>" Version="1.0"

ARG ENVIRONMENT="production"
ENV NODE_ENV=${ENVIRONMENT}
EXPOSE 4000
WORKDIR /code

COPY package.json yarn.lock ./
RUN yarn install
COPY build config ./code/
<%= additionalParts %>

CMD ["yarn", "start"]
