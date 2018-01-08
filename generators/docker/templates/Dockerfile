FROM node:8-alpine
LABEL Name="ComparaOnline <%= microserviceName %>" Version="1.0"

ARG ENVIRONMENT="production"
ARG CLEAR_BUILD_DEPENDENCIES=true

ENV \
  NODE_ENV=${ENVIRONMENT} \
  BUILD_LIBRDKAFKA=0

EXPOSE 4000

WORKDIR /code

COPY package.json yarn.lock ./

<%= additionalDependencies %>

RUN \
  # Build packages are not included in the final Docker image.
  apk add --no-cache --virtual .build-packages \
  bash \
  make \
  g++ \
  python \
  && \
  # Install node packages
  yarn install \
  && \
  # Clean up build packages.
  if ${CLEAR_BUILD_DEPENDENCIES}; then \
  yarn cache clean && apk del .build-packages; fi

COPY config/ ./config
COPY build/  ./
<%= additionalParts %>

CMD ["node", "index.js"]
