FROM php:8.2-fpm-alpine

# Instala dependências do sistema e Nginx
RUN apk add --no-cache \
    nginx \
    git \
    mysql-client \
    curl \
    supervisor \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql opcache \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# Instala o Composer globalmente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia todos os arquivos do seu projeto Laravel
COPY . .

# Instala as dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Gera a chave da aplicação
RUN php artisan key:generate

# Dá permissão para o usuário do Nginx/FPM acessar pastas
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copia o arquivo de configuração do Nginx (caminho relativo)
COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Cria a pasta e copia o arquivo de configuração do Supervisor
COPY supervisord.conf /etc/supervisord.conf

# Expõe a porta 80 do Nginx
EXPOSE 80

# Comando para iniciar o Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]