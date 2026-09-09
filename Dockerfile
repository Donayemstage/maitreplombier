FROM php:8.4-fpm

# Installation des extensions système
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nginx

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copie de tout le projet (y compris public/build compilé en local)
COPY . .

# Installation des dépendances PHP uniquement
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=80