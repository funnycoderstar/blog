## 手写 Webpack 的 Plugin 和 Loader

### Loader

Loader 本质是一个函数，接收源文件内容，返回转换后的内容。

**核心规则：**
- 接收的参数是源文件的字符串内容（或 Buffer）
- 必须返回 JavaScript 代码字符串，或传给下一个 loader
- 可通过 `this.getOptions()` 获取配置项
- 异步 loader 使用 `this.async()` 获取 callback

#### 示例：将 `console.log` 替换为空（去除日志的 loader）

```js
// remove-console-loader.js
module.exports = function (source) {
  // this 是 loader 的上下文对象
  const options = this.getOptions() || {};
  const methods = options.methods || ['log', 'warn', 'error'];
  const pattern = new RegExp(
    `console\\.(${methods.join('|')})\\(.*?\\);?`,
    'g'
  );
  return source.replace(pattern, '');
};
```

#### 示例：异步 Loader

```js
// async-loader.js
module.exports = function (source) {
  const callback = this.async();

  setTimeout(() => {
    const result = source.replace('hello', 'world');
    // callback(err, content, sourceMap, meta)
    callback(null, result);
  }, 100);
};
```

#### webpack.config.js 中使用

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, 'remove-console-loader.js'),
            options: { methods: ['log'] },
          },
        ],
      },
    ],
  },
};
```

---

### Plugin

Plugin 是一个类，通过监听 webpack 编译生命周期的 hooks 来完成任务。

**核心规则：**
- 必须实现 `apply(compiler)` 方法
- 通过 `compiler.hooks` 和 `compilation.hooks` 监听生命周期事件
- 使用 `tap` / `tapAsync` / `tapPromise` 注册钩子

#### 示例：生成文件列表的 Plugin

```js
// FileListPlugin.js
class FileListPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'file-list.md';
  }

  apply(compiler) {
    // emit: 生成资源到 output 目录之前触发
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const fileList = Object.keys(compilation.assets)
        .map((filename) => `- ${filename}`)
        .join('\n');

      const content = `# File List\n\n${fileList}\n`;

      // 将新文件加入到 webpack 输出资源中
      compilation.assets[this.filename] = {
        source: () => content,
        size: () => content.length,
      };

      callback();
    });
  }
}

module.exports = FileListPlugin;
```

#### webpack.config.js 中使用

```js
const FileListPlugin = require('./FileListPlugin');

module.exports = {
  plugins: [
    new FileListPlugin({ filename: 'assets.md' }),
  ],
};
```

---

### 常用 Compiler Hooks

| Hook | 时机 |
|---|---|
| `entryOption` | 处理完 entry 配置后 |
| `compile` | 开始编译前 |
| `make` | 开始构建 |
| `emit` | 输出文件到 output 目录前 |
| `done` | 编译完成 |

### 常用 Compilation Hooks

| Hook | 时机 |
|---|---|
| `buildModule` | 模块构建开始前 |
| `succeedModule` | 模块构建成功 |
| `optimizeChunks` | chunk 优化阶段 |
| `processAssets` | 处理资源（webpack 5 推荐）|
