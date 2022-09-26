## useCallback 和 useMemo 的区别

-   返回值：
    useCallback： 一个缓存的回调函数
    useMemo： 一个缓存的值

-   参数
    -   useCallback：需要缓存的函数，依赖项
    -   useMemo：需要缓存的值（也可以是个计算然后再返回值的函数）依赖项
-   使用场景：
    -   useCallback：父组件更新时，通过 props 传递给子组件的函数也会重新创建，这个时候使用 useCallback 就可以缓存函数不使它重新创建
    -   useMemo: 组件更新时，一些计算量很大的值也有可能被重新计算，这个时候就可以使用 useMemo 直接使用上一次缓存的值

### 参考

-   [useCallback 和 useMemo 的区别](https://www.jianshu.com/p/b8d27018ed22)
