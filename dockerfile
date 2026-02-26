FROM node:22-alpine AS build

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build


FROM node:22-alpine AS prod

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
RUN npm install --omit=dev


CMD [ "node","build" ]