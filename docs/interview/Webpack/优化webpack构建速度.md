## 优化 webpack 构建速度

为什么要提升构建速度：提升开发效率。因为我们日常的工作中几乎每时每刻都
主要从思路（what），方法(how)，以及为什么(why)这样可以提升构建速度的角度来分析。

### 一. 速度分析

1. 使用 webpack 内置的 stats

-   stats: 构建的统计信息
-   package.json 中使用 stats

颗粒度太粗, 看不出问题所在

2. 使用 speed-measure-webpack-plugin：可以看到每个 loader 和插件执行耗时

速度分析插件作用：

-   分析整个打包总耗时
-   每个插件和 loader 的耗时情况

### 二. 使用高版本的`webpack`和`NodeJs`

### 三. 多进程/多实例构建：资源并行解析可选方案

1. HappyPack
   原理：每次 webapck 解析一个模块，HappyPack 会将它及它的依赖分配给 worker 线程中

2. thread-loader
   原理：每次 webpack 解析一个模块，thread- loader 会将它及它的依赖分配给 worker 线程中

### 四：多进程并行压缩代码

1. 使用 `parallel-uglify-plugin` 插件
2. `uglifyjs-webpack-plugin` 开启 `parallel` 参数
3. terser-webpack-plugin 开启 parallel 参数

### 五.分包

1. 设置 `Externals`
   思路：将 react、react-dom 基础包通过 cdn 引入，不打入 bundle 中
   方法：使用 html-webpack-externals- plugin
   存在问题：每个包都要有一个对应的 cdn 文件，最后打包对应
2. 进一步分包：预编译资源模块 DLLPlugin
   思路：将 react、react-dom、redux、react-redux 基础包和业务基础包打包成一个文件
   方法：使用`DLLPlugin`进行分包，DllReferencePlugin 对 manifest.json 引用

### 六.缩小构建目标

1. 尽可能的少构建模块
   比如 babel-loader 不解析 node_modules

2. 减少文件搜索范围

-   优化 resolve.modules 配置（减少模块搜索层级）
-   优化 resolve.mainFields 配置
-   优化 resolve.extensions
-   配置 合理使用 alias

### 七. 缓存

目的：提升二次构建速度
缓存思路：

-   babel-loader 开启缓存
-   terser-webpack-plugin 开启缓存
-   使用 cache-loader 或者 hard-source-webpack-plugin

## 构建速度优化总结

1. 速度分析

-   使用 webpack 内置的 stats
-   使用 [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)

2. 使用高版本的`webpack`和`NodeJs`
3. 多进程/多实例构建

-   HappyPack
-   thread-loader
-   parallel-plugin

4. 多进程并行压缩代码

-   使用 `parallel-uglify-plugin` 插件
-   `uglifyjs-webpack-plugin` 开启 `parallel` 参数
-   terser-webpack-plugin 开启 parallel 参数

5. 分包：预编译资源模块

-   externals
-   使用 DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用

6. 缩小构建目标

-   配置 babel-loader 不解析 node_modules
-   减少文件搜索范围，配置

7. 充分利用缓存提升二次构建速度

-   babel-loader 开启缓存
-   terser-webpack-plugin 开启缓存
-   使用 cache-loader 或者 hard-source-webpack-plugin
