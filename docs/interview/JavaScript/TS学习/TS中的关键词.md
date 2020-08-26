## 常用的关键词
- typeof
- keyof
- type
- interface

## typeof 可以获取值的类型
```js
const obj = { a: '1' };
type Foo = typeof obj; // { a: string }
```
## keyof 可以获取对象类型的所有 key
```js
type Obj = { a: string; b: string }
type Foo = keyof obj; // 'a' | 'b'
```
## in 可以根据key 创建对象类型
```js
type Obj = { [T in 'a' | 'b' | 'c']: string; }
```
```js
type Obj = { a: string; b: string };
type Foo = obj['a'];// string
```

## 多关键词的组合用法
```js
const obj = { a: '1', b: '1' };
type Foo = keyof typeof obj; // 'a' | 'b'
const arr = [ 'a', 'b' ] as const;
type Foo = (typeof arr)[number]; // 'a' | 'b'
type Obj = { a: string; b: string };
type Foo = { [T in keyof Obj]: Obj[T] } // { a: string; b: string };
```
