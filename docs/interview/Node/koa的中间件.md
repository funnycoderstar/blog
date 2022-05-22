## Koa-bodyparser

bodyparser 是一类处理 request 的 body 的中间件函数，例如 Koa-bodyparser 就是和 Koa 框架搭配使用的中间件，帮助没有内置处理该功能的 Koa 框架提供解析 request.body 的方法，通过 app.use 加载 Koa-bodyparser 后，在 Koa 中就可以通过 ctx.request.body 访问到请求报文的报文实体啦!

要编写 body-parser 的代码，首先要了解两个方面的逻辑：请求相关事件和数据处理流程

### 请求相关事件

-   data 事件：当 request 接收到数据的时候触发，在数据传输结束前可能会触发多次，在事件回调里可以接收到 Buffer 类型的数据参数，我们可以将 Buffer 数据对象收集到数组里
-   end 事件：请求数据接收结束时候触发，不提供参数，我们可以在这里将之前收集的 Buffer 数组集中处理，最后输出将 request.body 输出。

### 数据处理流程

-   在 request 的 data 事件触发时候,收集 Buffer 对象，将其放到一个命名为 chunks 的数组中
-   在 request 的 end 事件触发时，通过 Buffer.concat(chunks)将 Buffer 数组整合成单一的大的 Buffer 对象
-   解析请求首部的 Content-Encoding，根据类型，如 gzip,deflate 等调用相应的解压缩函数如 Zlib.gunzip,将 2 中得到的 Buffer 解压，返回的是解压后的 Buffer 对象
-   解析请求的 charset 字符编码，根据其类型，如 gbk 或者 utf-8,调用 iconv 库提供的 decode(buffer, charset)方法，根据字符编码将 3 中的 Buffer 转换成字符串
-   最后,根据 Content-Type,如 application/json 或'application/x-www-form-urlencoded'对 4 中得到的字符串做相应的解析处理，得到最后的对象，作为 request.body 返回

-   [bodyparser 实现原理解析](https://zhuanlan.zhihu.com/p/78482006)
-   [玩转 Koa -- koa-bodyparser 原理解析](https://juejin.cn/post/6844903761966530568)
