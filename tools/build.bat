@echo off
setlocal
set app=concat.js
call efront build --export_to=exports --release
echo #!/usr/bin/env node>public\main
type coms\main.js>>public\main