# 全局安装使用

1. 安装
```sh
npm install -g png-concat
```

2. 合并图片windows平台代码如下，linux平台类似
```sh
cd /d YOUR_IMAGES_PATH
png-concat
```
其中`YOUR_IMAGES_PATH`是你的图片的文件夹

3. 指定生成的文件名
```sh
png-concat YOUR_CONCATED_FILE_NAME
```
其中`YOUR_CONCATED_FILE_NAME`是你想要输出的文件的文件名，也可以指定路径，默认为`png-concat.concat`

4. 指定生成的图标的比例或单位
如果是二倍图，可以指定生成比例为`2`，以优化高清屏上的显示效果
```sh
png-concat 2
```
可以使用`0.5px`作为参数，让图像的1像素变为css样式中的`0.5px`，达到同样的目的
```sh
png-concat .5px
```
可以使用的单位有 px,pt,rem,em,cm,mm，其他单位不支持

5. 命令行模式下，文件名和图标的大小可以同时传入，先后顺序不限
```sh
png-concat a.concat 33px
```
6. 生成的文件说明
1. `png-concat.concat.png` 最终合并的文件
2. `png-concat.concat.css` 合并文件的css样式表
3. `png-concat.concat.html` 图标引用示例

# 以模块的方式引用
```js
var concatpng = require("png-concat");
// 修改为你自己图片源路径和合并文件输出路径，参数的顺序固定
concatpng("/path/to/your/png/files/", "/path/to/your/destination/png-concat/files.concat", 1);
```