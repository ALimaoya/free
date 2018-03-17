FROM nginx:1.13.5

MAINTAINER Qihang <leiyang@ranbb.com>

COPY default.conf /etc/nginx/conf.d

COPY dist /usr/share/nginx/html

