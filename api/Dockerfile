# /api/Dockerfile

# 1. Etapa de build (compila TypeScript)
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY .env .env


COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build



# 2. Etapa de producción (solo el código compilado y dependencias necesarias)
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm install --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["node", "dist/index.js"]
