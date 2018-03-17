#!/bin/bash
workdir=$(pwd)
appname=$(basename ${workdir})
set -eux
npm run build
docker build -t docker.private/free-manager . && \
docker push docker.private/free-manager && \
echo ok
