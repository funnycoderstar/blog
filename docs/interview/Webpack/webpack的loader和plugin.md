## webpack 的 loader 和 plugin
### loader
对模块的源代码进行转换, webpack只能处理javaScript, 如果要处理其他类型的文件, 就需要使用loader进行转换;
1. loader可以使你在 import 或"加载"模块时预处理文件
2. loader允许你在javascript模块中 import css文件
3. 将文件从其他语言转为javascript, 比如ts-loader

常用的loader

- style-loader: 创建style标签将css文件嵌入到html中
- css-loader: 处理其中的@import和url()
- less-loader: 将less转为css
- url-loader: 将图片大小小于limit参数的转成base64的图片(data url), 大于limit参数的, url-loader会调用file-loader进行处理
- file-loader: 解析项目中的url引入(不仅限于css), 根据我们的配置, 将图片拷贝到响应的路径, 再根据我们的配置, 修改打包后文件使用路径, 使之指向正确的文件

### plugin
plugin: 插件, 用来扩展webpack功能

常用的plugin
- htmlWebpackPlugin: 根据模板自动生成html文件, 并自动引用css和js文件
- extract-text-webpack-plugin: 将Js中引用的样式文件单独抽离成css文件
- DefinePlugin: 编译时配置全局变量
- happypack：通过多进程模型，来加速代码构建