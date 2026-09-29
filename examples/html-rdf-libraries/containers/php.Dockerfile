FROM composer:2 AS composer
FROM php:8.4-cli
RUN apt-get update \
    && apt-get install -y --no-install-recommends libxml2-dev unzip \
    && docker-php-ext-install dom \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer /usr/bin/composer /usr/bin/composer
