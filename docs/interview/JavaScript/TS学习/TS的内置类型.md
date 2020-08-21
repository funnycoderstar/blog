## TS中一些内置的类型

文档： https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt 

### Partial
功能是将类型的属性变成可选，注意这是浅Partial
```js
type Partial<T> = { [P in keyof T]?: T[P] };
```
举例说明
```js
interface UserInfo {
    id: string;
    name: string;
}

// error： Property 'id' is missing in type '{ name: string; }' but required in type 'UserInfo'
const xiaoming: UserInfo = {
    name: 'xiaoming'
}
```
使用  Partial
```js
type NewUserInfo = Partial<UserInfo>;

const xiaoming: NewUserInfo = {
    name: 'xiaoming'
}
```
这个  NewUserInfo 就相当于 

```js
interface NewUserInfo {
    id?: string;
    name?: string;
}
```
但是 Partial 有个局限性，就是只支持处理第一层的属性，如果我的接口定义是这样的
```js
interface UserInfo {
    id: string;
    name: string;
    fruits: {
        appleNumber: number;
        orangeNumber: number;
    }
}

type NewUserInfo = Partial<UserInfo>;

// Property 'appleNumber' is missing in type '{ orangeNumber: number; }' but required in type '{ appleNumber: number; orangeNumber: number; }'.
const xiaoming: NewUserInfo = {
    name: 'xiaoming',
    fruits: {
        orangeNumber: 1,
    }
}
```
可以看到，第二层以后就不会处理了，如果要处理多层，就可以自己通过  [Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) 

DeepPartial
```js
\type DeepPartial<T> = {
     // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object
      ? DeepPartial<T[U]>
      : T[U]
};

type PartialedWindow = DeepPartial<Window>; // 现在window 上所有属性都变成了可选啦
```
### Required
功能和 Partial相反，是将类型的属性变成必填，这是 - 指的是去除。-?的意思就是去除可选，也就是必填了。
```js
type Required<T> = { [P in keyof T]-?: T[P] };
```

其中 -? 是代表移除 ? 这个 modifier 的标识。再拓展一下，除了可以应用于 ? 这个 modifiers ，还有应用在 readonly ，比如 Readonly 这个类型
```js
type Readonly<T> = {
    readonly [p in keyof T]: T[p];
}
```

### Pick
这个类型可以将某个类型的子
```js
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```
比如上面那个类型
```js
type NewUserInfo = Pick<UserInfo, 'name'>; // {name: string;}
```
可以看到 NewUserInfo 中就只有个 name 的属性了，这个类型还有更有用的地方，等讲到 Exclude 类型会说明。

### Record
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

### Exclude


### Mutable
功能是将类型的属性变成可修改，这里的 -指的是去除。 -readonly 意思就是去除只读，也就是可修改啦。
```js
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```
Readonly：功能和Mutable 相反，功能是将类型的属性变成只读， 在属性前面增加 readonly 意思会将其变成只读。
```js
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```
ReturnType： 功能是用来得到一个函数的返回值类型。
```js
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```
下面的示例用 ReturnType 获取到 Func 的返回值类型为 string，所以，foo 也就只能被赋值为字符串了。
```js
type Func = (value: number) => string;

const foo: ReturnType<Func> = "1";
```


更多参考[TS - es5.d.ts](https://github.com/microsoft/TypeScript/blob/master/src/lib/es5.d.ts#L1431) 

## 参考
- [TS 中的内置类型简述](https://github.com/whxaxes/blog/issues/14)
- [TypeScript 的工具类型](https://zhuanlan.zhihu.com/p/78180787)
- [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)