# 全局安装使用

## 1. 安装
```sh
npm install -g png-concat
```

## 2. 合并图片
windows平台代码如下，linux平台类似
```sh
cd /d YOUR_IMAGES_PATH
png-concat
```
其中`YOUR_IMAGES_PATH`是你的图片的文件夹

## 3. 指定生成的文件名
```sh
png-concat YOUR_CONCATED_FILE_NAME
```
其中`YOUR_CONCATED_FILE_NAME`是你想要输出的文件的文件名，也可以指定路径，默认为`png-concat.concat`

## 4. 指定生成的图标的比例或单位
如果是二倍图，可以指定生成比例为`2`，以优化高清屏上的显示效果
```sh
png-concat 2
```
可以使用`0.5px`作为参数，让图像的1像素变为css样式中的`0.5px`，达到同样的目的
```sh
png-concat .5px
```
可以使用的单位有 px,pt,rem,em,cm,mm，其他单位不支持
考虑到用户自己计算1rem是多个像素不方便，可以使用类似如下命令代替
```sh
png-concat 1rem=32px
```

命令行模式下，文件名和图标的大小可以同时传入，先后顺序不限

```sh
png-concat a.concat .33px
```
## 5. 生成的文件说明
* *1.* `png-concat.concat.png` 最终合并的文件
* *2.* `png-concat.concat.css` 合并文件的css样式表
* *3.* `png-concat.concat.html` 图标引用示例
* *4.* `png-concat.concat.json` 与mapbox同格式的json

## 6. 选择生成的文件
您可以传入扩展名指定最终输出的文件类型，如果不指定，将输出全部文件，可用的语法如下：
```sh 
    pngconcat .json
    pngconcat .css
    pngconcat .html
    pngconcat FILENAME.json
    pngconcat FILENAME.json|css
    pngconcat FILENAME.html|css|json
```

## 7. 指定生成的样式前缀
css样式表默认前缀为 png-concat-，可以传入以中划线`-`结尾的参数以指定前缀，如：
```sh
    pngconcat pc-
```

引入该命令生成的css后，指定元素的class的html如下：

```html
    <i class="pc pc-ICON_NAME"></i><!-- ICON_NAME 是图标的名字 -->
```
可在生成的 html 文件中找到所需的图标直接复制

* 注意：如果指定了前缀而不指定文件名，生成的文件名将以前缀为准。

# 以模块的方式引用
```js
var concatpng = require("png-concat");
// 修改为你自己图片源路径和合并文件输出路径，参数的顺序固定
concatpng("/path/to/your/png/files/", "/path/to/your/destination/png-concat/files.concat", 1, 'prefix');
```