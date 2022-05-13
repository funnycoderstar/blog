## 提升 webpack 编译速度

-   升级一些配置： node、webpack4.x、babel 7.x
-   多进程，happypack
-   使用 DLLPlugin 和 DLLReferencePlugin 插件，提前打包一些不经常变动的框架代码，比如 Vue，vue-router 等
    -   [深入浅出的 webpack 构建工具---DllPlugin DllReferencePlugin 提高构建速度(七)](https://www.cnblogs.com/tugenhua0707/p/9520780.html)
    -   [webpack 官方文档-dll plugin](https://webpack.js.org/plugins/dll-plugin/)
-   缓存：babel-loader 开启缓存， babel 的 cache Directory 为 true；添加 cache-loader
-   惰性编译，使用 lazy-compile-webpack-plugin， 通过延迟编译动态导入来提升 Webpack 启动时间
    -   这么说吧，你有一个大型项目，100 多个路由，全部动态 import，即使你只是想改某个页面的小功能，webpack 依然会把所有的路由都进行处理和构建，这个插件的功能就是只会构建最终会被浏览器加载的模块。

## 分析过程

### webpack 构建完整过程

-   初始化：启动构建，读取与合并配置参数， 加载[Plugin](https://www.webpackjs.com/api/plugins/), 实例化 [Compiler](https://www.webpackjs.com/api/compiler-hooks/)
-   编译：从 Entry 发出，针对每个[Module](https://webpack.docschina.org/concepts/modules/#src/components/Sidebar/Sidebar.jsx)串行调用对应的[Loader](https://webpack.docschina.org/concepts/loaders/#src/components/Sidebar/Sidebar.jsx)去翻译文件内容，再找到该 Module 依赖的 Module, 递归地进行编译处理。
-   输出：对编译后的 Module 组合成[Chunk](https://zhuanlan.zhihu.com/p/21318102), 把 Chunk 转换成文件，输出到本地。

### 分析 webpack 打包编译每步所需要的时间

### 使用 webapck 配置 dev-server 的[stats](https://webpack.js.org/configuration/stats/#stats)选项

```js
devServer: {
    stats: {
        timings: true,
        modules: true,
        assets: false,
        entrypoints: false,
        assetsSort: 'field',
        builtAt: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        performance: true,
        errors: true,
        warnings: true,
    },
}
```

[用实验的思路优化 webpack4 项目编译速度](https://juejin.im/post/5b8a07d1f265da433874f5ef)

### 使用插件 [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)

使用方法如下
npm i -D speed-measure-webpack-plugin

修改如下的 webpack 配置

```js
const webpackConfig = {
    plugins: [new MyPlugin(), new MyOtherPlugin()],
};
```

To

```js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap({
    plugins: [new MyPlugin(), new MyOtherPlugin()],
});
```

## 升级 babel 7 && webapck 4

```js
npx babel-upgrade --write
```

-   [vue-loader 的变更](https://vue-loader.vuejs.org/zh/migrating.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E4%B8%8D%E5%85%BC%E5%AE%B9%E5%8F%98%E6%9B%B4)
-   [babel 7.x 更新](https://babel.docschina.org/docs/en/7.0.0/v7-migration)

配置文件由 `.babelrc`改为 `babel.config.js`
包重命名：babylon 现在是 @babel/parser

## webpack 4

-   [webpack4 升级完全指南](https://segmentfault.com/a/1190000014247030)
-   [webpack3 升级到 webpack4](https://github.com/diamont1001/webpack-summary/issues/4)

npm i -D webpack-cli

mode 的修改

vue-loader 新版本用法的修改
clean-webpack-plugin 新版本用法的修改

-   [mini-css-extract-plugin](https://www.jianshu.com/p/91e60af11cc9)
-   [深入浅出的 webpack 构建工具---DllPlugin DllReferencePlugin 提高构建速度(七)](https://www.cnblogs.com/tugenhua0707/p/9520780.html)
-   [webpack 优化之 HappyPack 实战](https://juejin.im/post/5ad9b0ecf265da0b7155d521)

## 参考

-   [构建性能优化探索](https://github.com/pigcan/blog/issues/1)
-   [happypack 多线程](https://github.com/amireh/happypack)
-   [缓存 cache-loader](https://github.com/webpack-contrib/cache-loader)
-   [Webpack4+Babel7 优化 70%速度](https://juejin.im/post/5c763885e51d457380771ab0)

## webpack 打包体积

-   iview，moment, loadsh 按需加载，
-   使用 DLLPlugin 和 DLLReferencePlugin 插件，提前打包一些不经常变动的框架代码，比如 Vue，vue-router 等
-   @babel/polyfill 按需加载，配置 useBuiltIns,
    -   useBuiltIns 值为 entry，会把 如是 entry，会在入口处把所有 ie8 以上浏览器不支持 api 的 polyfill 引入进来
    -   useBuiltIns 值为 usage，它会扫描你的代码，只有你的代码用到了哪个新的 api，它才会引入相应的 polyfill

webpack-bundle-analyzer 分析包的体积
