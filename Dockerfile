# 1) Etapa de build
FROM node:20.14-alpine AS builder
WORKDIR /app

# Copiamos sólo los package.json para cachear dependencias
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Inyectamos la URL de la API al build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Generamos la carpeta 'dist' con Vite
RUN npm run build

# 2) Etapa de runtime: servimos el 'dist'
FROM node:20.14-alpine
WORKDIR /app

# Instalamos 'serve' para servir estático
RUN npm install -g serve

# Traemos únicamente la carpeta 'dist' generada
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
