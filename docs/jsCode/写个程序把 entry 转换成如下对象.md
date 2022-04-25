## entry 对象转换题目一

```js
var entry = {
    a: {
        b: {
            c: {
                dd: 'abcdd',
            },
        },
        d: {
            xx: 'adxx',
        },
        e: 'ae',
    },
};

// 要求转换成如下对象
var output = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
};
```

### 代码

```js
function flatObj(obj, parentKey = '', res = {}) {
    for (let key in obj) {
        let keyName = `${parentKey}${key}`;
        if (typeof obj[key] === 'object') {
            flatObj(obj[key], keyName + '.', res);
        } else {
            res[keyName] = obj[key];
        }
    }
    return res;
}
```

## entry 对象转换题目二

```js
var entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
};

// 要求转换成如下对象
var output = {
    a: {
        b: {
            c: {
                dd: 'abcdd',
            },
        },
        d: {
            xx: 'adxx',
        },
        e: 'ae',
    },
};
```

### 代码

1. 将路径分解成数组
2. 利用对象为地址引用原理，进行增加元素。

迭代：

```js
function convert(entryObj) {
    const result = {};
    for (let key in entryObj) {
        // 对象中的key含有点的，就是对象嵌套，使用 split分隔为数组，数组的最后一个下标对应的就是元素就是 一个key的值
        const keyMap = key.split('.');
        // 储存对象最深属性的引用地址
        let temp = result;
        for (let i = 0; i < keyMap.length; i++) {
            if (!temp[keyMap[i]]) {
                // 如果是最后一个直接就是 value；
                const curValue = i === keyMap.length - 1 ? entryObj[key] : {};
                temp[keyMap[i]] = curValue;
            }
            // 利用对象为地址引用原理，进行增加元素。
            temp = temp[keyMap[i]];
        }
    }
    return result;
}
```
