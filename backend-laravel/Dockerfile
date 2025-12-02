FROM php:8.2-cli-alpine

RUN apk add --no-cache \
    bash \
    curl \
    zip \
    unzip \
    git \
    openssl \
    ca-certificates \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev

RUN update-ca-certificates

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo_pgsql mbstring bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress || true

RUN mkdir -p storage/framework/{sessions,views,cache} \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 0777 storage bootstrap/cache || true

EXPOSE 8000

CMD ["sh", "-c", "php artisan migrate --force || true; php artisan serve --host=0.0.0.0 --port ${PORT}"]
