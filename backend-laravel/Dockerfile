FROM php:8.2-cli-alpine

# dependências essenciais
RUN apk add --no-cache \
    bash \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev

# extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo_mysql mbstring bcmath gd

# composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# copia o código
COPY . .

# instala dependências
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress || true

# permissões
RUN mkdir -p storage/framework/{sessions,views,cache} \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 0777 storage bootstrap/cache || true

# expõe (opcional)
EXPOSE 8000

# start: usa a porta que o Render fornece no runtime ($PORT). Se não existir usa 8000
CMD ["sh", "-c", "php artisan migrate --force || true; php artisan serve --host=0.0.0.0 --port ${PORT:-8000}"]
