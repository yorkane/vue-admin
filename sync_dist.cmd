yarn run build
cd dist
:<<BAT
@echo off

git add

goto end
BAT

cd dist
sudo git add ./

:<<ECHO
:end
ECHO
