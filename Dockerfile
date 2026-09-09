# Étape 1: Compilation du Frontend avec Node
FROM node:20-slim AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Étape 2: Application Laravel PHP
FROM php:8.4-fpm
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nginx

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .
COPY --from=frontend /app/public/build /var/www/public/build

RUN composer install --no-dev --optimize-autoloader

EXPOSE 80

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=80