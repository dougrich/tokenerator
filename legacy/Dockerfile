FROM nginx:latest

COPY ./src/site.conf /etc/nginx/conf.d/default.conf
COPY ./src/root /var/www

RUN nginx -t