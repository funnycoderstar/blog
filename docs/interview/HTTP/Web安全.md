## XSS
跨站脚本攻击（Cross Site Script）,本来缩写是 CSS, 但是为了和层叠样式表（Cascading Style Sheet, CSS）有所区分，所以安全领域叫做 “XSS”；

XSS攻击，通常是指攻击者通过 “HTML注入”篡改了网页，插入了恶意的脚本，从而在用户浏览网页时，对用户的浏览器进行控制或者获取用户的敏感信息（Cookie, SessionID等）的一种攻击方式。
s
XSS攻击可以分为三类：反射型，存储型，DOM based XSS

### 反射型
恶意脚本作为网络请求的一部分。

```js
const Koa = require("koa");
const app = new Koa();

app.use(async ctx => {
    // ctx.body 即服务端响应的数据
    ctx.body = '<script>alert("反射型 XSS 攻击")</script>';
})

app.listen(3000, () => {
    console.log('启动成功');
});

```
访问 http://127.0.0.1:3000/ 可以看到 alert执行

举一个常见的场景，我们通过页面的url的一个参数来控制页面的展示内容，比如我们把上面的一部分代码改成下面这样
```js
app.use(async ctx => {
    // ctx.body 即服务端响应的数据
    ctx.body = ctx.query.userName;
})
```
此时访问 http://127.0.0.1:3000?userName=xiaoming 可以看到页面上展示了`xiaoming`，此时我们访问 `http://127.0.0.1:3000?userName=<script>alert("反射型 XSS 攻击")</script>`, 可以看到页面弹出 alert。

在实际的开发过程中，我们会碰到这样的场景，在页面A中点击某个操作，这个按钮操作是需要登录权限的，所以需要跳转到登录页面，登录完成之后再跳转会A页面，我们是这么处理的，跳转登录页面的时候，会加一个参数 returnUrl，表示登录完成之后需要跳转到哪个页面，即这个地址是这样的 `http://xxx.com/login?returnUrl=http://xxx.com/A`，假如这个时候把returnUrl改成一个script脚本，而你在登录完成之后，如果没有对returnUrl进行合法性判断，而直接通过window.location.href=returnUrl，这个时候这个恶意脚本就会执行。

### 存储型
存储型会把用户输入的数据“存储”在服务器。

比较常见的一个场景就是，攻击者在社区或论坛写下一篇包含恶意 JavaScript代码的博客文章或评论，文章或评论发表后，所有访问该博客文章或评论的用户，都会在他们的浏览器中执行这段恶意的JavaScript代码。



### 文档型
通过修改页面的DOM节点

## 防御XSS




## CSRF
跨站请求伪造（Cross Site Request Forgery）

## 预防CSRF


## 参考
- [前端安全系列（一）：如何防止XSS攻击？](https://juejin.im/post/5bad9140e51d450e935c6d64)
- [前端安全系列之二：如何防止CSRF攻击？](https://juejin.im/post/5bc009996fb9a05d0a055192)
- [浅说 XSS 和 CSRF ](https://github.com/dwqs/blog/issues/68)
- [《白帽子讲 Web 安全》](https://book.douban.com/subject/10546925/)
