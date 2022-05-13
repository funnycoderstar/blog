## 优化 webpack 打包体积

### 一. 使用 webpack-bundle-analyzer 分析包的体积

```js
```

构建完成后会在 8888 端口展示大小。

可以分析哪些问题？

1. 依赖的第三方模块文件大小
2. 业务里面的组件代码大小

### 二. 使用 webpack 进行图片压缩

分析页面加载资源，会发现图片会占用很大的体积。所以要对图片进行压缩，除了我们自己手动去使用其他平台压缩之外，还可以在 webpack 中配置压缩

-   要求：基于 Node 库的 imagemin 或者 tinypng API
-   使用：配置 image-webpack-loader

Imagemin 的优点分析

-   有很多定制选项
-   可以引入更多第三方优化插件，例如 pngquant
-   可以处理多种图片格式

### 三：tree shaking

1. 删除无用的 JS

使用：

-   webpack 默认支持，在 .babelrc 里设置 modules: false 即可
-   production mode 的情况下默认开启
    要求：必须是 ES6 的语法，CJS 的方式不支持

2. 删除无用的 CSS

-   PurifyCSS: 遍历代码，识别已经用到的 CSS class
-   uncss: HTML 需要通过 jsdom 加载，所有的样式通过 PostCSS 解析，通过 document.querySelector 来识别在 html 文件里面不存在的选择器

3.

## 体积优化策略总结

1. 使用 webpack-bundle-analyzer 分析包的体积
2. 使用 webpack 进行图片压缩
3. 使用 TreeShaing 删除无用的 JS 和 css
4. 动态 Polyfill
5. 公共资源分离
6. Scope Hoisting
