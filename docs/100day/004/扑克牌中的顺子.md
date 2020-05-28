# 扑克牌中的顺子

JavaScript实现LeetCode第61题：扑克牌中的顺子

## 题目描述

从扑克牌中随机抽5张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

```js
示例 1:
输入: [1,2,3,4,5]
输出: True
 

示例 2:
输入: [0,0,1,2,5]
输出: True
```
限制：
1.数组长度为 5 
2.数组的数取值为 [0, 13] .

## 思路分析
- 1. 先判断数组长度是否为5，如果不是，则直接返回false
- 2. 对数组进行排序，声明两个变量，一个为 `wangNums`，用来存储王的个数，一个为 `grapNums`，用来存储 排序后元素的差值
- 3. 遍历数组，`nums[i]`如果值为0，则 `wangNums++`，如果`nums[i] == nums[i+1]`则直接返回false, 其他情况，计算差值，累加到 `grapNums`
- 4. 最后判断如果 差值 (`grapNums`)小于王(`wangNums`)的个数，说明可以用王来构成顺子，返回true，否则返回false

## 解法
```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function(nums) {
    if(nums.length != 5) {
        return false;
    }

    nums.sort((a, b) => a - b);
    let wangNums = 0; // 王的个数
    let grapNums = 0; // 排序后元素的差值
    for(let i = 0; i < nums.length - 1; i++) {
         if(nums[i] == 0) {
            wangNums++;
         } else if(nums[i] == nums[i+1]) {
             //不是王，并且还是对子，那肯定不是顺子了
             return false;
         } else {
            //不是王，计算一下两两的差值，最后与王的个数做比较
            grapNums += (nums[i+1] - nums[i] - 1);
         }
    }
    //差值小于王的个数，说明可以用王来构成顺子
    if(grapNums <= wangNums) {
        return true;
    }
    return false;
};
```
