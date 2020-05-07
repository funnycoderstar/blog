## HTTP 的请求方法有哪些？GET和POST区别？
### HTTP 的请求方法
- GET:获取资源
- POST:传输实体主体
- PUT：传输文件
- HEAD:获得报文首部
- DELETE:删除文件
- OPTIONS:询问支持的方法
- TRACE: 追踪路径TRACE方法是让Web服务器端将之前的请求通信环回给客户端的方法。
    - 发送请求时，在Max-Forwards首部字段中填入数值，每经过一个服务器端就将该数字减1，当数值刚好减到0时，就停止继续传输，最后接收到请求的服务器端则返回状态码200OK的响应。
- CONNECT: 要求用隧道协议链接代理

### GET和POST区别
- 缓存: GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会
- 编码: GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。
- 参数: GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
- 幂等: GET是幂等的，而POST不是。(幂等表示执行相同的操作，结果也是相同的)
- TCP: GET请求会把浏览器会把http header和data一次性发出去，而POST会分成两个TCP数据包，首先发Header部分，如果服务器响应100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)
