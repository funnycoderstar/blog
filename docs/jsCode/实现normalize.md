```js
/**
 * 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
示例一: 'abc' --> {value: 'abc'}
示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}
 */

function normalize(str) {
    const arr = str.match(/\w+/g);
    let result;
    while (arr.length) {
        const cur = arr.pop();
        let temp = { value: cur };
        if (result) {
            temp.children = result;
        }
        result = temp;
    }
    return result;
}
console.log(normalize('[abc[bcd[def]]]'));
```
