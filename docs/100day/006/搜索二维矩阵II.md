## 题目描述
编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target。该矩阵具有以下特性：

每行的元素从左到右升序排列。
每列的元素从上到下升序排列。

示例:
现有矩阵 matrix 如下：
```js

[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
给定 target = 5，返回 true。

给定 target = 20，返回 false。
```
## 解题思路

分治法
-  左下角的元素是这一行中最小的元素, 是这一列中最大的元素, 比较左下角和目标
    - 若左下角元素等于目标元素则找到
    - 若左下角元素小于目标元素,则目标不可能存在当前矩阵的这一列, 问题规则可以减小为在去掉这一列的子矩阵中寻找目标
    - 若左下角元素大于目标元素,则目标不可能存在当前矩阵的这一行, 问题规则可以减小为在去掉这一行的子矩阵中寻找目标
- 若最后矩阵减小为空, 则说明不存在

## 代码实现

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const m = matrix.length;
    if (m === 0) {
        return false;
    }
    const n = matrix[0].length;
    if (n === 0) {
        return false;
    }
    let i = m - 1;
    let j = 0;
    while (i >= 0 && j < n) {
        if (matrix[i][j] === target) {
            return true;
        } else if (matrix[i][j] < target) {
            j++;
        } else {
            i--;
        }
    }
    return false;
};


```