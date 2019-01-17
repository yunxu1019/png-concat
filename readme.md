## 全局安装使用

1. 安装
```sh
npm install -g png-concat
```

2. 合并图片windows平台代码如下，linux平台类似
```sh
cd /d YOU_IMAGES_PATH
png-concat
```
其中`YOU_IMAGES_PATH`是你的图片的文件夹

##. 生成的文件说明
    1. png-concat.concat.png 最终合并的文件
    2. png-concat.concat.css 合并文件的css样式表
    3. png-concat.concat.html 图标引用示例

## 以模块的方式引用
```js
var concatpng = require("png-concat");
// 修改为你自己图片源路径和合并文件输出路径
concatpng("/path/to/your/png/files/","/path/to/your/destination/png-concat/files.concat");
```