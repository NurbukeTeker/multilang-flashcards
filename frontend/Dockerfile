# Frontend Dockerfile - multilang-flashcards

# --- Build aşaması ---
FROM node:18 AS build
WORKDIR /app

# bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# kaynak kodları kopyala
COPY . .

# production build
RUN npm run build

# --- Serve aşaması ---
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
