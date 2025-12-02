FROM php:8.2-fpm-alpine

# dependências essenciais
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
    postgresql-dev \
    libpq

# atualiza certificados
RUN update-ca-certificates

# extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo pdo_pgsql mbstring bcmath gd

# composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# copia a aplicação
COPY . .

# remove configs cacheados ANTIGOS (ESSENCIAL)
RUN rm -f bootstrap/cache/config.php bootstrap/cache/packages.php || true

# limpa caches ANTES da instalação
RUN php artisan config:clear || true
RUN php artisan cache:clear || true

# instala dependências Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress || true

# permissões
RUN mkdir -p storage/framework/{sessions,views,cache} \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 0777 storage bootstrap/cache || true

EXPOSE 8000

CMD ["sh", "-c", "php artisan migrate --force || true; php artisan serve --host=0.0.0.0 --port ${PORT:-8000}"]
