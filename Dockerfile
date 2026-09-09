FROM php:8.4-fpm

# Installation des dépendances système et extensions PHP
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nginx

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Node.js 20 (LTS) au lieu de Node 18
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Installation des dépendances PHP et compilation Frontend (avec fix npm)
RUN composer install --no-dev --optimize-autoloader
RUN npm install --legacy-peer-deps && npm run build

EXPOSE 80

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=80