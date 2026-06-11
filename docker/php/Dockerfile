FROM php:8.3-fpm-bookworm

ARG INSTALL_OFFICE=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    bash \
    git \
    unzip \
    imagemagick \
    libmagickwand-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    poppler-utils \
    ghostscript \
    qpdf \
    && if [ "$INSTALL_OFFICE" = "true" ]; then \
        apt-get install -y --no-install-recommends libreoffice-core libreoffice-writer libreoffice-calc; \
    fi \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql gd zip intl bcmath pcntl exif \
    && pecl install redis imagick \
    && docker-php-ext-enable redis imagick \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/pear

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
