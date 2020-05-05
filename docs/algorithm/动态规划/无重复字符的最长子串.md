
JavaScript实现LeetCode第3题：无重复字符的最长子串
## 题目描述
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:
```js
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```
示例 2:
```js
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```
示例 3:
```js
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```
## 解题思路
这是一道动态规划题目

1.声明两个变量
- `currentString`： 当前无重复字符的子串，
- `max`： 无重复字符的最大子串长度

2.判断当前的最长串中是否有该字母`s[i]`,
  - 如果没有,则加上`s[i]`,
  - 如果有，则需要从重复的位置断开，开始新的计算
  - 计算该次循环出现的无重复字符的最大子串长度
## 解题方案
```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let currentString = '';
    let max = 0;
    for(let i = 0; i < s.length; i++) {
        const index = currentString.indexOf(s[i]);
          // 判断当前的最长串中是否有该字母
        if( index < 0) { 
           // 如果没有,则加上s[i]
            currentString += s[i];
        } else { 
           // 如果有，则需要从重复的位置断开，开始新的计算
            currentString = currentString.substring(index + 1) + s[i];
        }
        max = Math.max(max, currentString.length);
    }
    return max;
};
```