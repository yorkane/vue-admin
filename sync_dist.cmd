:<<BAT
start nginx.exe -c %~dp0conf\nginx_dev.conf
@echo off
goto end
BAT

rm -f /usr/local/openresty/nginx/html/index.html
rm -rf /usr/local/openresty/nginx/html/__static/css/
rm -rf /usr/local/openresty/nginx/html/__static/js/
rm -rf /usr/local/openresty/nginx/html/__static/fonts/
rm -rf /usr/local/openresty/nginx/html/__static/img/

cp dist/index.html /usr/local/openresty/nginx/html/
cp -R dist/__static/css/ /usr/local/openresty/nginx/html/__static/css/
cp -R dist/__static/js/ /usr/local/openresty/nginx/html/__static/js/
cp -R dist/__static/fonts/ /usr/local/openresty/nginx/html/__static/fonts/
cp -R dist/__static/img/ /usr/local/openresty/nginx/html/__static/img/

sudo chown -R nobody:web /usr/local/openresty/nginx/html/
sudo chmod -R 776 /usr/local/openresty/nginx/html/
cd /usr/local/openresty/nginx/
sudo git add ./html/__static/


:<<ECHO
:end
ECHO
