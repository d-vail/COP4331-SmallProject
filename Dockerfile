FROM php:7.4-apache-buster
RUN docker-php-ext-install mysqli pdo pdo_mysql json
