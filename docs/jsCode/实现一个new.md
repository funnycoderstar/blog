## 实现一个 new 

要从 new 干了什么入手：

1. 创建一个新的空对象 obj
2. 将新对象的的原型指向当前函数的原型
3. 新创建的对象绑定到当前this上
4. 如果没有返回其他对象，就返回 obj，否则返回其他对象

```js
function _new(constructor, ...arg) {
    // ① 创建一个新的空对象 obj
    const obj = {};
    // ② 将新对象的的原型指向当前函数的原型
    obj.__proto__ = constructor.prototype;
    // ③ 新创建的对象绑定到当前this上
    const result = constructor.apply(obj, arg); 
    // ④ 如果没有返回其他对象，就返回 obj，否则返回其他对象
    return typeof result === 'object' ? result : obj;
}
function Foo(name) {
    this.name = name;
}
var luckyStar = _new(Foo, 'luckyStar');
luckyStar.name; //luckyStar
```