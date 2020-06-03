## CSRF
跨站请求伪造（Cross Site Request Forgery），是指黑客诱导用户打开黑客的网站，在黑客的网站中，利用用户的登陆状态发起的跨站请求。CSRF攻击就是利用了用户的登陆状态，并通过第三方的站点来做一个坏事。

要完成一次CSRF攻击,受害者依次完成两个步骤:
1. 登录受信任网站A，并在本地生成Cookie
2. 在不登出A的情况，访问危险网站B

![CSRF攻击](https://upload-images.jianshu.io/upload_images/3297464-7d361cb4873ee1ae.png?imageMogr2/auto-orient/strip|imageView2/2/w/1092/format/webp)

a.com
登陆后种下cookie, 然后有个支付的页面，支付页面有个 诱导点击的按钮或者图片

b.com，中的页面请求 a.com的接口，b.com 其实拿不到cookie
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CSRF-demo</title>
    <style>
        .login-wrap {
            height: 180px;
            width: 300px;
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
        }
        input {
            width: 300px;
        }
        .payInfo {
            display: none;
        }
        .money {
            font-size: 16px;
        }
    </style>
</head>

<body>
    <div class="login-wrap">
        <input type="text" placeholder="用户名" class="userName">
        <br>
        <input type="password" placeholder="密码" class="password">
        <br>
        <br>
        <button class="btn">登陆</button>
        <div class="payInfo">
            <h3>转账信息</h3>
            <p >当前账户余额为 <span class="money">0</span>元</p>
            <input type="text" placeholder="收款方" class="account">
            <button class="pay">支付10元</button>
            <!-- <a href="http://127.0.0.1:3100/bad.html">听说点击这个链接的人都赚大钱了，你还不来看一下么</a> -->
        </div>
    </div>
</body>
<script>
    var btn = document.querySelector('.btn');
    let currentName = '';
    btn.onclick = function () {
        var userName = document.querySelector('.userName').value;
        currentName = userName;
        var password = document.querySelector('.password').value;
        var money = document.querySelector('.money');
        var payInfo = document.querySelector('.payInfo');
        fetch('http://127.0.0.1:3200/login', {
            method: 'POST', 
            credentials: 'same-origin',
            body: JSON.stringify({
                userName,
                password
            }),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                // alert(res.msg);
                payInfo.style.display = "block"
                money.innerHTML = res.data.money;
                
            })
            .catch(err => {
                message.error(`本地测试错误${err.message}`);
                console.error('本地测试错误', err);
            });
    }
    var pay = document.querySelector('.pay');
    pay.onclick = function () {
        var money = document.querySelector('.money');
        fetch('http://127.0.0.1:3200/pay', {
            credentials: 'include',
            method: 'POST', 
            body: JSON.stringify({
                userName: currentName,
                money: 10
            }),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                alert(res.msg);
                money.innerHTML = res.data.money;
            })
            .catch(err => {
                message.error(`本地测试错误${err.message}`);
                console.error('本地测试错误', err);
            });
    }
    
</script>

</html>
```
使用 `koa-static`使前后端在同一个域

```js
const Koa = require("koa");
const app = new Koa();
const route = require('koa-route');
var bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const KoaStatic = require('koa-static');

let currentUserName = '';

const secret = 'your_secret_string'; // 加密用的SECRET字符串，可随意更改
app.use(KoaStatic(__dirname));
app.use(bodyParser()); // 处理post请求的参数
let money = 1000;

const login = ctx => {
    const req = ctx.request.body;
    const userName = req.userName;
    currentUserName = userName;
    // 简单设置一个cookie
    ctx.cookies.set(
        'name', 
        userName,
        {
          domain: '127.0.0.1',  // 写cookie所在的域名
          path: '/',       // 写cookie所在的路径
          maxAge: 10 * 60 * 1000, // cookie有效时长
          expires: new Date('2021-02-15'),  // cookie失效时间
          overwrite: false,  // 是否允许重写
          SameSite: 'None',
        }
      )
    ctx.response.body = {
        data: {
            money,
        },
        msg: '登陆成功'
    };
}

const pay = ctx => {
    money = money - Number(ctx.request.body.money);
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.response.body = {
        data: {
            money,
        },
        msg: '支付成功'
    };
    // if(ctx.cookies.get('name')){
    //     ctx.response.body = {
    //         data: {
    //             money: money - Number(ctx.request.body.money),
    //         },
    //         msg: '登陆成功'
    //     };
    // }else{
    //     ctx.body = '未登录';
    // }
}
app.use((ctx, next)=> {
    console.log(ctx.request.headers);
    const headers = ctx.request.headers;
    if(ctx.method === 'OPTIONS') {
        ctx.set('Access-Control-Allow-Origin', headers.origin);
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.status = 204;
    } else {
        next();
    }
})

app.use(cors());
app.use(route.post('/login', login));
app.use(route.post('/pay', pay));


app.listen(3200, () => {
    console.log('启动成功');
});

```

### 自动发起Get请求

```js
<!DOCTYPE html>
<html>
  <body>
    <h1>黑客的站点：CSRF攻击演示</h1>
    <img src="http://127.0.0.1:3200/payMoney?money=1000">
  </body>
</html>
```
当用户访问含有这个img的页面后，浏览器会自动向自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么会认为这是一个正常的链接。

### 自动发起POST请求

```html
<body>
    <div>
        哈哈，小样儿，哪有赚大钱的方法，还是踏实努力工作吧！
        <!-- form 表单的提交会伴随着跳转到action中指定 的url 链接，为了阻止这一行为，可以通过设置一个隐藏的iframe 页面，并将form 的target 属性指向这个iframe，当前页面iframe则不会刷新页面 -->
        <form action="http://127.0.0.1:3200/pay" method="POST" class="form" target="targetIfr">
            <input type="text" name="userName" value="xiaoming">
            <input type="text" name="money" value="100">
        </form>
        <iframe name="targetIfr" style="display:none"></iframe>
    </div>
</body>
<script>
    document.querySelector('.form').submit();
</script>
```

### 引导用户点击链接
诱惑用户点击链接跳转到黑客自己的网站，示例代码如图所示
```js
<a href="http://127.0.0.1:3100/bad.html">听说点击这个链接的人都赚大钱了，你还不来看一下么</a>
```
用户点击这个地址就会跳到黑客的网站，黑客的网站可能会自动发送一些请求，比如上面提到的自动发起Get或Post请求。这样用户的账户余额就被转到黑客自己的账户下了

## 如何防止CSRF

### 利用cookie的SameSite
SameSite有3个值： Strict, Lax和None
1. Strict。浏览器会完全禁止第三方cookie。比如a.com的页面中访问 b.com 的资源，那么a.com中的cookie不会被发送到 b.com服务器，只有从b.com的站点去请求b.com的资源，才会带上这些Cookie
2. Lax。相对宽松一些，在跨站点的情况下，从第三方站点链接打开和从第三方站点提交 Get方式的表单这两种方式都会携带Cookie。但如果在第三方站点中使用POST方法或者通过 img、Iframe等标签加载的URL，这些场景都不会携带Cookie。
3. None。任何情况下都会发送 Cookie数据

我们可以根据实际情况将一些关键的Cookie设置 Stirct或者 Lax模式，这样在跨站点请求的时候，这些关键的Cookie就不会被发送到服务器，从而使得CSRF攻击失败。
### 验证请求的来源点
由于CSRF攻击大多来自第三方站点，可以在服务器端验证请求来源的站点，禁止第三方站点的请求。
可以通过HTTP请求头中的 Referer和Origin属性。

![HTTP请求头](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1591176981248.png)

### CSRF Token
1. 最开始浏览器向服务器发起请求时，服务器生成一个CSRF Token。CSRF Token其实就是服务器生成的字符串，然后将该字符串种植到返回的页面中(可以通过Cookie)
2. 浏览器之后再发起请求的时候，需要带上页面中的 `CSRF Token`（在request中要带上之前获取到的Token，比如 `x-csrf-token：xxxx`）, 然后服务器会验证该Token是否合法。第三方网站发出去的请求是无法获取到 `CSRF Token`的值的。

## 同源策略
页面安全问题的主要原因就是浏览器为同源策略开了两个后门：
- 页面中可以任意引用第三方的资源
- 通过CORS策略让XMLHttpRequest 和 Fetch 去跨域请求资源。

为了解决这些问题，我们引入了 CSP 来限制页面任意引入外部资源，引入了 HttpOnly 机制来禁止 XMLHttpRequest 或者 Fetch 发送一些关键 Cookie，引入了 SameSite 和 Origin 来防止 CSRF 攻击。


如果没有同源策略，会是怎样？
比如你打开了一个银行站点，然后又一不小心打开了一个恶意站点，如果没有安全措施，恶意站点就可以做很多事情：
- 修改银行站点的 DOM、CSSOM 等信息；
- 在银行站点内部插入 JavaScript 脚本；劫持用户登录的用户名和密码；
- 读取银行站点的 Cookie、IndexDB 等数据；
- 甚至还可以将这些信息上传至自己的服务器，这样就可以在你不知情的情况下伪造一些转账请求等信息。

提交表单不受同源政策的限制。
为了避免出现上面的问题，所以引入了同源策略。

### 同源策略主要体现在DOM, Web数据和网络这三个层面
1. DOM层面。同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。
window.opener  用于返回打开当前窗口的那个窗口的引用。
- 如果当前窗口是由另一个窗口打开的,   window.opener 保留了那个窗口的引用
- 如果当前窗口不是由其他窗口打开的, 则该属性返回 null

2. Web数据层面

同源策略限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。由于同源策略，我们依然无法通过第二个页面的 opener 来访问第一个页面中的 Cookie、IndexDB 或者 LocalStorage 等内容。
3. 网络
同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。

同源策略会隔离不同源的 DOM、页面数据和网络通信，进而实现 Web 页面的安全性。

### 浏览器出让了同源策略的哪些安全性。
1. 页面中可以嵌入第三方资源
同源策略要求，一个页面中所有资源都来自同一个源，也就是这个页面中所有的HTML文件，JavaScript文件，CSS文件，图片等都部署在同一台服务器。带来很多限制，比如将不同的资源部署到不同的 CDN 上时，CDN 上的资源就部署在另外一个域名上。

CSP 的核心思想是让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执行内联 JavaScript 代码
2. 跨域资源共享和跨文档消息机制
引入了跨域资源共享（CORS），使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。

如果两个页面不是同源的，则无法相互操纵 DOM。不过在实际应用中，经常需要两个不同源的 DOM 之间进行通信，于是浏览器中又引入了跨文档消息机制，可以通过 window.postMessage 的 JavaScript 接口来和不同源的 DOM 进行通信。

### Cookie
Cookie 是服务器写入浏览器的一小段信息，只有同源的网页才能共享。但是，两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置document.domain共享 Cookie。

举例来说，A网页是http://w1.example.com/a.html，B网页是http://w2.example.com/b.html，那么只要设置相同的document.domain，两个网页就可以共享Cookie。

```js
document.domain = 'example.com';
```
现在，A网页通过脚本设置一个 Cookie。
```js
document.cookie = "test1=hello";
```
B网页就可以读到这个 Cookie。
```js
var allCookie = document.cookie;
```
注意，这种方法只适用于 Cookie 和 iframe 窗口，LocalStorage 和 IndexDB 无法通过这种方法，规避同源政策，而要使用下文介绍的PostMessage API。

另外，服务器也可以在设置Cookie的时候，指定Cookie的所属域名为一级域名，比如.example.com。

```js
Set-Cookie: key=value; domain=.example.com; path=/
```
这样的话，二级域名和三级域名不用做任何设置，都可以读取这个Cookie。


- [浏览器同源政策及其规避方法](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)

很多知识点的关联
1. 同源策略
2. 跨域
3. XSS
4. CSRF
5. cookie，cookie的sameSite, 同源和不同源的cookie获取
6. 安全问题
## 参考
- [前端安全系列（一）：如何防止XSS攻击？](https://juejin.im/post/5bad9140e51d450e935c6d64)
- [前端安全系列之二：如何防止CSRF攻击？](https://juejin.im/post/5bc009996fb9a05d0a055192)
- [浅说 XSS 和 CSRF ](https://github.com/dwqs/blog/issues/68)
- [《白帽子讲 Web 安全》](https://book.douban.com/subject/10546925/)
