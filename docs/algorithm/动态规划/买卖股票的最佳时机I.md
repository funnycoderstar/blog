
这是leetcode 121题： https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/

### 题目描述
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票），设计一个算法来计算你所能获取的最大利润。

注意你不能在买入股票前卖出股票。

示例 1:
```js
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```
示例 2:
```js
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

### 解答思路
#### 本题可以理解

假设我在第N天买入, 求计算以后几天的价格和第N天价格相差最多的一天。
也就是说在第N天的时候，要做两个判断，
 - 1. `price[n]`是否为最低价，需要重新计算最低价 
 - 2. 计算当前的最大利润

#### 解题思路

- 设置两个变量
    - `maxProfit`: 最大利润值, 初始值为0 
    - `minPrice`: 当前最低价格,初始值为Number.MAX_SAFE_INTEGER（任何一个值肯定都比这个初始值小）
- 遍历`prices`里的每一个值
     - 求出`minPrice和prices[i]`两个中的最小值，赋值给minPrice；
     - 求出`maxProfit`,和`（prices[i] - minPrice`）的最大值，赋值给`maxProfit`。
### 解答方案
```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // minPrice表示最小价格， 需要在最小价格的时候买入
    let minPrice = Number.MAX_SAFE_INTEGER;
    // 当前最大利润, 在最大利润的时候卖出
    let maxProfit = 0;
    for(let i = 0; i < prices.length; i++) {
        minPrice = Math.min(minPrice, prices[i])
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    return maxProfit;
};
```

