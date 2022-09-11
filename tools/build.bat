@echo off
setlocal
set app=concat.js
call efront build --export_to=exports
move public\comm\concat public\concat
echo #!/usr/bin/env node>public\main
type coms\main.js>>public\main
rd /s /q public\comm