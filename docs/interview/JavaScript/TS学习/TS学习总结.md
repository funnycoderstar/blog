## TS 中的一些关键词总结

最近一直在写 TS,偶尔会遇到一些自己之前没见过的一些符号或者关键词，就随手记录下来，本篇文章就是对这段时间遇到的进行了总结。

## 目录概览

-   TS 中的一些符号
-   `!` 断言操作符
-   `?.` 链判断运算符

-   TS 中的一些关键词

    -   `type`
    -   `interface`
    -   `typeof`
    -   `keyof`
    -   `in`

-   TS 中的一些内置类型
    -   `Partial<T>` 将类型的属性变成可选
    -   `Required<T>`将类型的属性变成必选
    -   `Pick` 从某个类型中挑出一些属性出来
    -   `Record`
    -   `Mutable<T>` 将类型的属性变成可修改
    -   `Readonly<T>` 类型的属性变成只读
    -   `ReturnType` 用来得到一个函数的返回值类型

> 下面的一些例子都可以在 [TypeScript Playground](https://www.typescriptlang.org/play) 中进行尝试。左侧是 TS，右侧是编译后的 JS。

![](https://cdn.ionestar.cn/blog/20200917222944.png)

## TS 中的一些符号

### `!` 断言操作符

`!` 的作用是断言某个变量不会是 `null/undefined`，告诉编辑器停止报错。

```js
const obj = {
    name: '牧码的星星'
}
const a = obj!.name; // 假设 obj是你从后端获取的获取
```

确定 obj.name 一定是存在的且不是`null/undefined`，使用`!` 只是消除编辑器报错，不会对运行有任何影响。

属性或者参数中使用 `!`，表示强制解析（告诉 typescript 编译器，这里一定有值）;
变量后使用 `!`: 表示类型推荐排除 null/undefined。

### `?.` 链判断运算符

```js
const orderId = response.result.data.orderId;
```

上面这种写法，很容易出现这种问题 `orderId is undefined`，稍微有些经验的我们立马就能想到，肯定是代码中 `response.result.data` 为 `null` 或者 `undefined` ，这样，你肯定获取不到 `orderId`。所以经验丰富的我们在遇到获取层级比较多的对象的时候，一般都是像下面这样写。

```js
// 正确的写法
const orderId =
    (response && response.result && response.result.data && response.result.data.orderId) || '';
```

我们可以使用 `?.` 来简化上面的代码。

```js
const orderId = response?.result?.data?.orderId || '';
```

上面代码使用了?.运算符，直接在链式调用的时候判断，左侧的对象是否为 null 或 undefined。如果是的，就不再往下运算，而是返回 undefined。

`?.` 支持如下语法

```js
obj?.prop; // 对象属性
obj?.[expr]; // 对象属性
arr?.[index]; // 获取数据中 index 下标对应的值
func?.(...args); // 函数或对象方法的调用
```

> `?.`和 `&&` 的区别

## TS 中的一些关键词

### type 类型别名用来给一个类型起个新名字

```js
type SetUser = (name: string, age: number) => void;
```

类型别名常用于联合类型（联合类型表示取值可以为多种类型中的一种），比如常见的如下写法

```js
type UploadType = 'drag' | 'select';
```

### interface

interface 和 type 的用法其实差不多，interface 也是用来定义类型的

```js
interface SetUser = {
    (name: string, age: number) => void;
}

```

### type 和 interface 的区别

都支持拓展，但是语法不同

```js
interface Name {
    name: string;
}
interface User extends Name {
    age: number;
}
```

```js
type Name = {
    name: string,
};
type User = Name & { age: number };
```

### typeof 可以获取一个变量的声明类型

在 JavaScript 中， `typeof` 可以判断一个变量的基础数据类型， 在 TS 中，它还可以获取一个变量的声明类型

```js
const obj = { a: '1' };
type Foo = typeof obj;
// type Foo = { a: string }
```

### keyof 可以获取一个对象接口的所有 key 值

```js
type Obj = { a: string; b: string }
type Foo = keyof obj;
// type Foo = 'a' | 'b';
```

### in 可以遍历枚举类型

```js
type Keys = 'a' | 'b' | 'c';
type Obj = {
    [ T in Keys]: string;
}
// in 遍历 Keys，并为每个值赋予 string 类型

// type Obj = {
//     a: string,
//     b: string,
//     c: string
// }
```

## TS 中一些内置的类型

官方文档： https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt

用到了上面提到的一些关键词

### `Partial<T>` 将类型的属性变成可选

功能是将类型的属性变成可选，注意这是`浅Partial`

```js
type Partial<T> = {
    [P in keyof T]?: T[P]
};
```

举例说明

```js
interface UserInfo {
    id: string;
    name: string;
}

// error： Property 'id' is missing in type '{ name: string; }' but required in type 'UserInfo'
const xiaoming: UserInfo = {
    name: 'xiaoming',
};
```

使用 `Partial<T>`

```js
type NewUserInfo = Partial<UserInfo>;

const xiaoming: NewUserInfo = {
    name: 'xiaoming',
};
```

这个 NewUserInfo 就相当于

```js
interface NewUserInfo {
    id?: string;
    name?: string;
}
```

但是 `Partial<T>` 有个局限性，就是只支持处理第一层的属性，如果我的接口定义是这样的

```js
interface UserInfo {
    id: string;
    name: string;
    fruits: {
        appleNumber: number,
        orangeNumber: number,
    };
}

type NewUserInfo = Partial<UserInfo>;

// Property 'appleNumber' is missing in type '{ orangeNumber: number; }' but required in type '{ appleNumber: number; orangeNumber: number; }'.
const xiaoming: NewUserInfo = {
    name: 'xiaoming',
    fruits: {
        orangeNumber: 1,
    },
};
```

可以看到，第二层以后就不会处理了，如果要处理多层，就可以自己通过 [Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

DeepPartial

```js
type DeepPartial<T> = {
     // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object
      ? DeepPartial<T[U]>
      : T[U]
};

type PartialedWindow = DeepPartial<Window>; // 现在window 上所有属性都变成了可选啦
```

### Required<T> 将类型的属性变成必选

```js
type Required<T> = {
    [P in keyof T]-?: T[P]
};
```

其中 `-?` 是代表移除 `?` 这个 modifier 的标识。再拓展一下，除了可以应用于 `?` 这个 modifiers ，还有应用在 `readonly` ，比如 `Readonly<T>` 这个类型

```js
type Readonly<T> = {
    readonly [p in keyof T]: T[p];
}
```

### Pick 从某个类型中挑出一些属性出来

```js
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

```js
interface UserInfo {
    id: string;
    name: string;
}
type NewUserInfo = Pick<UserInfo, 'name'>; // {name: string;}
```

可以看到 NewUserInfo 中就只有个 name 的属性了。

### `Record`

可以获得根据 K 中所有可能值来设置 key 以及 value 的类型

```js
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

举个例子

```js
type CurRecord = Record<'a' | 'b' | 'c', UserInfo>; // { a: UserInfo; b: UserInfo; c: UserInfo; }
```

### `Mutable<T>` 将类型的属性变成可修改

功能是将类型的属性变成可修改，这里的 `-`指的是去除。 `-readonly` 意思就是去除只读，也就是可修改啦。

```js
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

### `Readonly<T>` 类型的属性变成只读

```js
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
};
```

### `ReturnType` 用来得到一个函数的返回值类型

```js
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

`infer`在这里用于提取函数类型的返回值类型。`ReturnType<T>` 只是将 infer R 从参数位置移动到返回值位置，因此此时 R 即是表示待推断的返回值类型。

下面的示例用`ReturnType`获取到 `Func` 的返回值类型为 `string`，所以，`foo` 也就只能被赋值为字符串了。

```js
type Func = (value: number) => string;

const foo: ReturnType<Func> = '1';
```

更多参考[TS - es5.d.ts](https://github.com/microsoft/TypeScript/blob/master/src/lib/es5.d.ts#L1431)

## 参考

-   [细数 TS 中那些奇怪的符号](https://segmentfault.com/a/1190000023943952)
-   [TypeScript 中高级应用与最佳实践](https://juejin.im/post/6844903904140853255#heading-9)
-   [TS 中的内置类型简述](https://github.com/whxaxes/blog/issues/14)
-   [TypeScript 的工具类型](https://zhuanlan.zhihu.com/p/78180787)
-   [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

## 送书活动

为了感谢各位小星星们一直以来对 `【牧码的星星】`的大力支持和肯定，现在推出如下送书活动。

### 奖项设置

**《TypeScript 项目开发实战》 1 本**

![](https://cdn.ionestar.cn/blog/20200918000615.png)

本书是一本`TypeScript`进阶实践指南，通过 9 个实用项目，详细讲解如何使用`TypeScript 3.0`和不同的`JavaScript`框架开发高质量的应用程序。书中不仅介绍`TypeScript`的核心概念与技术，还涵盖`Angular`和`React`的一些新功能，以及`GraphQL`、微服务和机器学习等相关的新技术。

同时可点击下方链接进行购买～

### 参与方式

参与方式很简单，**关注 `【牧码的星星】`公众号回复 `666`, 参与抽奖**。

### 截止时间

-   活动截止到 2020 年 9 月 21 号 中午 12：00
-   兑奖截止时间 2020 年 9 月 23 号 中午 12：00

### 温馨提示

请在开奖前添加我的微信，否则将无法领取奖品。
