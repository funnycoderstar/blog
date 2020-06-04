
## 买卖股票的最佳时机

## 目录
- leetcode 121题：买卖股票的最佳时机I
- leetcode 122题：买卖股票的最佳时机II

两道都是 `Easy` 的题目，所以放到一起。

## 买卖股票的最佳时机I
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

## 买卖股票的最佳时机II

这是leetcode 122题： https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/

### 题目描述
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

示例 1:
```js
输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
```
示例 2:
```js
输入: [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
     因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
```
示例 3:
```js
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```
### 解答思路

#### 题目简析
跟`买卖股票的最佳时机 I`的差别就是可以无限买入和卖出,我们都知道炒股想挣钱就是低价买入,高价卖出.
我们可以从第二天开始,如果当前价格比之前高,则把差值加到利润中,因为我可以昨天买入,今天卖出, 如果明日价更高的话,还可以今日买入,明天再卖出.以此类推,遍历完整个数组后即可求得最大利润

#### 思路
1. 设置两个变量 buy, sell, 分别代表买入和买入的股票
2. 若prices[i] >= sell，将sell设置为prices[i]，否则，就把这次的买卖加入总利润中，重新设置买卖金额为prices[i]。
3. 遍历完之后，最后一次的买卖尚未加入总利润中，所以还得加一次。

### 解答方法
```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    if(prices.length < 2) {
        return 0;
    }
    
    let buy = prices[0]; // 买入
    let sell = prices[0]; // 卖出
    let result = 0;
    // 在prices[i]小的时候买入,在大的时候卖出
    for(let i = 1; i < prices.length; i++) {
        // 当前的prices[i]大的的时候卖出
        if(prices[i] >= sell) {
            sell = prices[i];
        } else {
            // prices[i]小的时候m买入
            result += sell - buy;
            // 在此时初始化
            buy = prices[i];
            sell = prices[i];
        }
    }
    result += sell - buy;
    return result;
};
```

> 这是一道快手的面试题。记得第一次去面试的时候，没有回答出最优解，然后就直接没有了然后。真的很尴尬，现在很多比较另我们程序员们向往的公司，基本都会有算法题，而且大多数都是要求手写或者在codepen等在线编辑器上写。

面试的时候基本要求半个小时之内写出最优解。我们平常做题的时候很少有人会去计算时间的，所以之后练习的时候要注意给自己计个时。