# syntax=docker/dockerfile:1.7-labs

# Stage 1: Build the application
FROM node:20 AS build

WORKDIR /usr/src/app
COPY . .

RUN --mount=type=cache,target=/root/.npm \
    npm ci && npm run generate:i18nkeys && npm run build

# Stage 2: Create the final image without source files
FROM node:20-alpine

ARG TICKETZ_REGISTRY_URL

# Install dockerize for waiting for database
RUN apk add --no-cache wget ca-certificates \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && apk del wget

WORKDIR /usr/src/app

# Copy only the necessary build artifacts from the build stage
COPY --from=build --parents \
  /usr/src/app/./dist \
  /usr/src/app/./node_modules \
  /usr/src/app/./package.json \
  /usr/src/app/./scripts \
  .

# Install postgresql-client for psql commands
RUN apk add --no-cache postgresql-client

# Verify scripts exist and make them executable
RUN echo "=== Listing scripts directory ===" && ls -la ./scripts/ && echo "=== Making script executable ===" && chmod +x ./scripts/load-retrieved.sh && echo "=== Verifying script permissions ===" && ls -la ./scripts/load-retrieved.sh

# Copy script directly from build stage as backup
COPY --from=build /usr/src/app/scripts/load-retrieved.sh /usr/src/app/scripts/load-retrieved.sh
RUN chmod +x /usr/src/app/scripts/load-retrieved.sh

ENV NODE_ENV=production
ENV PORT=3000
ENV TICKETZ_REGISTRY_URL=${TICKETZ_REGISTRY_URL}

EXPOSE 3000

CMD ["sh", "-c", "dockerize -wait tcp://${DB_HOST}:5432 -timeout 60s && npx sequelize db:migrate --config dist/config/database.js --migrations-path dist/database/migrations && echo 'Script not found, skipping...' && exit_code=0 && if [ $exit_code -eq 1 ]; then npm run mark-seeds; exit 0; elif [ $exit_code -ge 100 ]; then exit 1; fi && npx sequelize db:seed:all --config dist/config/database.js --seeders-path dist/database/seeds && node dist/server.js"]
