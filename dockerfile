FROM node:18.20.4 AS base
WORKDIR /app
EXPOSE 3000

ENV OPENAI_API_KEY=$OPENAI_API_KEY
ARG OPENAI_API_KEY

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

FROM base AS development
RUN npm ci --include=dev
USER node
CMD npm run start:dev

FROM base AS production
USER node
CMD npm run start

FROM base AS test
RUN npm ci --include=dev
USER node
RUN npm test
