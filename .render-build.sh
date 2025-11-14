#!/usr/bin/env bash

# Muda o diretório para onde o Dockerfile realmente está
cd depoimentos/backend-laravel

# Roda o comando de build do Docker a partir deste novo contexto
docker build . -t $RENDER_EXTERNAL_HOSTNAME