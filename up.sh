#!/bin/bash
workdir=$(pwd)
appname=$(basename ${workdir})
set -eux
npm run build
docker build -t docker.pri/free-manager . && \
docker push docker.pri/free-manager && \
echo ok
