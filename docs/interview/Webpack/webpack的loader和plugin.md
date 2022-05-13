## webpack 的 loader 和 plugin

### loader

对模块的源代码进行转换, webpack 只能处理 javaScript, 如果要处理其他类型的文件, 就需要使用 loader 进行转换;

1. loader 可以使你在 import 或"加载"模块时预处理文件
2. loader 允许你在 javascript 模块中 import css 文件
3. 将文件从其他语言转为 javascript, 比如 ts-loader

常用的 loader

-   style-loader: 创建 style 标签将 css 文件嵌入到 html 中
-   css-loader: 处理其中的@import 和 url()
-   less-loader: 将 less 转为 css
-   url-loader: 将图片大小小于 limit 参数的转成 base64 的图片(data url), 大于 limit 参数的, url-loader 会调用 file-loader 进行处理
-   file-loader: 解析项目中的 url 引入(不仅限于 css), 根据我们的配置, 将图片拷贝到响应的路径, 再根据我们的配置, 修改打包后文件使用路径, 使之指向正确的文件

### plugin

plugin: 插件, 用来扩展 webpack 功能

常用的 plugin

-   htmlWebpackPlugin: 根据模板自动生成 html 文件, 并自动引用 css 和 js 文件
-   extract-text-webpack-plugin: 将 Js 中引用的样式文件单独抽离成 css 文件
-   DefinePlugin: 编译时配置全局变量
-   happypack：通过多进程模型，来加速代码构建
