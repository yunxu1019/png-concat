@echo off
setlocal
set app=concat.js
call efront build --export_to=exports --release %*
call efront build main.js --target=node --sourcedir %*