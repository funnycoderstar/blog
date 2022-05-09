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

### 递归

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

### 迭代

-   分步骤思考
-   1. 如果 entry[prop] 的值不是对象，则直接给 result 赋值
-   2. 如果 entry[prop] 是对象，则需要将当前的 key 和上次的 key 拼接起来，传入函数，直到满足条件一

怎么递归的拼接好 key:将 obj 作为参数传入，把上一个的 key 和这一次的拼接好

```js
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function parse(obj, entry, keyString) {
    for (let [key, value] of Object.entries(entry)) {
        let curkeyString = keyString + '.' + key;
        if (isObject(value)) {
            parse(obj, value, curkeyString);
        } else {
            obj[curkeyString] = value;
        }
    }
}
function convert(entry) {
    let resultObj = {};
    for (let prop in entry) {
        if (isObject(entry[prop])) {
            parse(resultObj, entry[prop], prop);
        } else {
            resultObj[prop] = entry[prop];
        }
    }
    return resultObj;
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

解法一：

```js
function setValue(obj, keys, value) {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // 判断是否为最后一个值
        if (i !== keys.length - 1) {
            // 不是最后一个值，判断obj[key]为空时，赋值{}
            obj[key] = obj[key] || {};
        } else {
            obj[key] = value;
        }
        // 将obj[key]赋值给obj
        obj = obj[key];
    }
}
function convert(entry) {
    let result = {};
    for (let key of Object.keys(entry)) {
        const keyList = key.split('.');
        setValue(result, keyList, entry[key]);
    }
    return result;
}
```

解法二

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
