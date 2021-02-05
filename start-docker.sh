#!/bin/sh

docker build -t apache2-dev .
docker run -dit --name local-apache2-server -p 8080:80 apache2-dev