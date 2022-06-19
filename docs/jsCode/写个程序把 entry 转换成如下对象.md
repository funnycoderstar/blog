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

### 迭代 + 递归

-   分步骤思考
-   1. 如果 entry[prop] 的值不是对象，则直接给 result 赋值
-   2. 如果 entry[prop] 是对象，则需要将当前的 key 和上次的 key 拼接起来，传入函数，直到满足条件一

怎么递归的拼接好 key:将 obj 作为参数传入，把上一个的 key 和这一次的拼接好

```js
function setValue(obj, parentKey, objValue) {
    // 关键点：判断objValue是否为对象
    if (typeof objValue === 'object' && objValue !== null) {
        for (let [key, value] of Object.entries(objValue)) {
            // 关键点：拼接 key
            let curKey = objKey + '.' + key;
            setValue(obj, curKey, value);
        }
    } else {
        obj[parentKey] = objValue;
    }
}
function convert(entry) {
    let obj = {};
    for (let [key, value] of Object.entries(entry)) {
        setValue(obj, key, value);
    }
    return obj;
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
var entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
};

function parse(obj, keys, value) {
    // 利用它是引用类型，temp值修改，obj的值也会修改
    //  储存对象最深属性的引用地址
    // 关键点1
    let temp = obj;
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        // 关键点2
        // 如果是最后一个key，则直接赋值
        if (i === keys.length - 1) {
            temp[key] = value;
        } else {
            // 不是最后一个则需要递归，将temp[key]赋值为 temp
            // 利用对象为地址引用原理，进行增加元素。
            // 关键点3
            temp[key] = temp[key] || {};
            temp = temp[key];
        }
    }
}
function convert(entry) {
    let obj = {};
    for (let [key, value] of Object.entries(entry)) {
        // 对象中的key含有点的，就是对象嵌套，使用 split分隔为数组，数组的最后一个下标对应的就是元素就是 一个key的值
        //  关键点
        let keys = key.split('.');
        parse(obj, keys, value);
    }
    return obj;
}
console.log(JSON.stringify(convert(entry)));
```
