@echo off
setlocal
set app=concat.js
call efront publish exports
move public\comm\concat public\concat
echo #!/usr/bin/env node>public\main
echo var concat = require("./concat");>>public\main
type coms\main.js>>public\main
rd /s /q public\comm