## 题目描述

给定一个正整数 n，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。

示例:
```js
输入: 3
输出:
[
 [ 1, 2, 3 ],
 [ 8, 9, 4 ],
 [ 7, 6, 5 ]
]
```


## 解题方法

和 [螺旋矩阵](./螺旋矩阵.md)的解法类似，只不过现在是要将数组打印出来。

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var generateMatrix = function(n) {
    if(n === 0) {
        return [];
    }
    // 初始化
    let result = new Array(n);
    for(let i = 0; i < n; i++) {
        result[i] = [];
    }
    let maxCount = n * n;
    // 定义四个边界
    let boundTop = 0; // 上边界
    let boundBottom = n - 1; // 下边界
    let boundLeft = 0; // 左变界
    let boundRight = n - 1; // 右边界
    // 定义四个方向，根据不同状态进行切换
    // 如果右边界为0（只有1个值），则初始化方向为下
    let direction = boundRight === 0 ? "down" : 'right'; 
    let i = 0;  // 列坐标
    let j = 0; // 行坐标
    for(let k = 1; k <= maxCount; k++) {
        // 进行赋值
        result[i][j] = k;
        /**
         * 1. 在其方向为右 且未触碰边界值时 列向右走（j++）
         * 2. 当触碰时转向，应该向下走，且上边界加1
         */
        if(direction === 'right') {
            j++;
            if(j === boundRight) {
                direction = 'down';
                boundTop++;
            }
        }
        /**
         * 1. 在其方向为下 且未触碰边界值时 向下走（i++）
         * 2. 当触碰时转向，应该向左走，且右边界减1
         */
        else if(direction === 'down') {
            i++;
            if(i === boundBottom) {
                direction = 'left';
                boundRight--;
            }
        }
        /**
         * 1. 在其方向为左 且未触碰边界值时 向左走（j--）
         * 2. 当触碰时转向，应该向上走，且下边界减1
         */
        else if(direction === 'left') {
            j--;
            if(j === boundLeft) {
                direction = 'up';
                boundBottom--;
            }
        }
        /**
         * 1. 在其方向为上 且未触碰边界值时 向上走（i--）
         * 2. 当触碰时转向，应该向右走，且左边界加1
         */
        else if(direction === 'up') {
            i--;
            if(i === boundTop) {
                direction = 'right';
                boundLeft++;
            }
        }
    }
    return result;

};
```