## 题目描述

给定一个非负整数数组 A， A 中一半整数是奇数，一半整数是偶数。

对数组进行排序，以便当 A[i] 为奇数时，i 也是奇数；当 A[i] 为偶数时， i 也是偶数。

你可以返回任何满足上述条件的数组作为答案。

 

示例：
```js
输入：[4,2,5,7]
输出：[4,5,2,7]
解释：[4,7,2,5]，[2,5,4,7]，[2,7,4,5] 也会被接受。
 
```
提示：
```js
2 <= A.length <= 20000
A.length % 2 == 0
0 <= A[i] <= 1000
```

## 思路
找出奇数位上和偶数和偶数位上的奇数进行交换

## 代码实现
```js
/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParityII = function(A) {
    let j = 1;
    for(let i = 0; i < A.length;) {
        if(i % 2 == A[i] % 2 ) {
            i++;
            if(j === i) {
                j++;
            }
            continue;
        }
        [A[i], A[j]] = [A[j], A[i]];
        j++;
    }
    return A;
};
```