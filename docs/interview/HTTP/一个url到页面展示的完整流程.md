## 网络篇
浏览器端发起 HTTP 请求流程
1. 构建请求
2. 查找强缓存
3. DNS解析
4. 建立 TCP 连接
5. 发送 HTTP 请求
服务器端处理 HTTP 请求流程
1. 返回请求
2. 断开连接
通常情况下，一旦服务器在发送给客户端

## 解析篇
1. 构建 DOM 树
2. 样式计算
3. 生成布局树

## 渲染
1. 图层树
2. 生成绘制列表
3. 生成图块和生成位图
4. 显示器显示内容


## 涉及到的其他知识点
- 强缓存和协商缓存
- 浏览器的多进程架构
- DNS解析
- HTTP1.0、HTTP1.1 、HTTP2.0
- 如何优化页面性能

### 强缓存和协商缓存
强缓存：
- HTTP1.0： expries
- HTTP1.1： cache-control: max-age

### 浏览器的多进程架构
#### 浏览器的内核是多进程的

- brower进程（主进程）
    - 负责浏览器的页面展示，与用户交互。如前进，后退
    - 页面的前进，后退
    - 负责页面的管理，创建和销毁其他进程
- GPU进程
    - 3D渲染
- 插件进程
    - 每种类型的插件对应一个进程，仅当使用该插件时才能创建
- 浏览器渲染进程（浏览器内核）
    - GUI渲染进程
        - DOM解析， CSS解析，生成渲染树
    - js引擎线程
        - 执行Js代码
    - 事件触发
        - 管理着一个任务队列
    - 异步HTTP请求线程
    - 定时触发器线程

可以看到 js引擎是浏览器渲染进程的一个线程。

#### 浏览器内核中线程之间的关系
- GUI渲染线程和JS引擎线程互斥
    - js是可以操作DOM的，如果在修改这些元素的同时渲染页面（js线程和ui线程同时运行），那么渲染线程前后获得的元素数据可能就不一致了。
- JS阻塞页面加载
   - js如果执行时间过长就会阻塞页面

#### 浏览器是多进程的优点
- 默认新开 一个 tab 页面 新建 一个进程,所以单个 tab 页面崩溃不会影响到整个浏览器。
- 第三方插件崩溃也不会影响到整个浏览器。
- 多进程可以充分利用现代 CPU 多核的优势。
- 方便使用沙盒模型隔离插件等进程,提高浏览器的稳定性。

## 如果CSS文件阻塞了，会阻塞DOM树的合成么，会阻塞页面的显示吗
从服务器接收HTML页面的第一批数据时，DOM解析器就开始工作了，在解析的过程中，如果遇到了JS脚本，如下所示
```js
<html>
    <body>
     Hello world
    <script>
     document.write("--foo")
    </script>
</body>
</html>
```
那么DOM解析器会优先执行JavaScript脚本，执行完成之后，再继续往下解析
那么第二种情况复杂点了，我们内嵌的脚本替换成JS外部文件，如下所示
```js
<html>
    <body>
        Hello world
        <script type="text/javascript" src="app.js"></script>
    </body>
</html>
```
这种情况下，当解析遇到JavaScript的时候，会先暂停DOM解析，并下载app.js文件，下载完成之后执行该JS文件，然后再往下解析DOM，这就是JavaScript文件为什么会阻塞DOM渲染。
我们再看第三种情况，还是看下面代码
```js
<html>
    <head>
        <style type="text/css" src = "theme.css" />
    </head>
    <body>
        <p>Hello world</p>
        <script>
            let e = document.getElementsByTagName('p')[0]
            e.style.color = 'blue'
        </script>
    </body>
</html>
```
当我在JavaScript中访问了某个元素的样式，那么这时候就需要等待这个样式被下载完成才继续往下执行，所以这种情况下，CSS也会阻塞DOM的解析。
所以JS和CSS都有可能会阻塞DOM解析。



## 参考
- [(1.6w字)浏览器灵魂之问，请问你能接得住几个？](https://juejin.im/post/5df5bcea6fb9a016091def69)
- [从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://juejin.im/post/5aa5cb846fb9a028e25d2fb1)
