实现 flat

1. 使用 reduce

```js
const flat = (arr) => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
    }, []);
};
```

## 参考

-   [数组拍平（扁平化） flat 方法实现](https://segmentfault.com/a/1190000021366004)
