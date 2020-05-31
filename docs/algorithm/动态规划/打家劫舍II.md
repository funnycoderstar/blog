
JavaScript实现leetcode213.  打家劫舍 II

## 题目描述

你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都围成一圈，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

示例 1:
```js
输入: [2,3,2]
输出: 3
解释: 你不能先偷窃 1 号房屋（金额 = 2），然后偷窃 3 号房屋（金额 = 2）, 因为他们是相邻的。

```
示例 2:
```js
输入: [1,2,3,1]
输出: 4
解释: 你可以先偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。
     偷窃到的最高金额 = 1 + 3 = 4 。

```
## 解题思路

使用动态规划解答。

此题 是[《打家劫舍》](./打家劫舍.md) 的拓展版，唯一的区别就是此题中的房间是 环状排列的（即首尾相连）。
环状排列意味着第一个房子和第一个房子只能选择一个偷盗，最后的答案就是两种情况中的最大值。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if(nums.length === 0) {
        return 0
    }
    if(nums.length === 1) {
        return nums[0]
    }

    var rob1 = function(nums) {
        const len = nums.length;
        if(len === 0) {
            return 0;
        }
        if(len === 1) {
            return nums[0];
        }
        let prevMax = nums[0];
        let currentMax = Math.max(nums[0], nums[1]);
        for(let i = 2; i < len; i++) {
            const temp  = currentMax;
            currentMax = Math.max(currentMax, prevMax + nums[i]);
            prevMax = temp;
        }
        return currentMax;
    };
    return Math.max(rob1(nums.slice(1)), rob1(nums.slice(0, nums.length - 1)));
};
```