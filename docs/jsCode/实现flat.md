## 实现 flat

具体可以参考 MDN 上的 [Array.prototype.flat()的替代方案](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#%E6%9B%BF%E4%BB%A3%E6%96%B9%E6%A1%88)

1. 直接使用递归实现

```js
const a = [1, [2, [3, [4, 5]]]];
const flat = (arr) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flat(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
};
console.log(flat(a));
```

2. 使用 reduce

```js
const flat = (arr) => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
    }, []);
};
```

通过传入整数参数控制“拉平”层数

```js
// 使用 reduce、concat 和递归展开无限多层嵌套的数组
var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
function flatDeep(arr, d = 1) {
    return d > 0
        ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
        : arr.slice();
}
flatDeep(arr1, Infinity);
// [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

3. 拓展运算符

```js
const flatten = (arr) => {
    while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
};
console.log(flatten(a));
```

4. split 和 toString 共同处理

```js
const flat = (arr) => {
    return arr.toString().split(',');
};
console.log(flat(a));
```

## 参考

-   [数组拍平（扁平化） flat 方法实现](https://segmentfault.com/a/1190000021366004)
-   [MDN-Array.prototype.flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
