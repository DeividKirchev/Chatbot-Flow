FROM node:18.20.4 as base
WORKDIR /app
EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

FROM base as development
RUN npm ci --include=dev
USER node
CMD npm run start:dev

FROM base as production
USER node
CMD npm run start
