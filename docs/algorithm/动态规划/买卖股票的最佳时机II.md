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

有一种更简单理解的解法：
贪心算法，只要第i天比第 i - 1 天的价格高，就直接算到当前利润中。
```js
/**
 * @param {number[]} prices
 * @return {number}
 * 多次买入和卖出
 */
var maxProfit = function(prices) {
    let maxProfit = 0;
    for(let i = 1; i < prices.length; i++) {
        if(prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    return maxProfit;
};
```