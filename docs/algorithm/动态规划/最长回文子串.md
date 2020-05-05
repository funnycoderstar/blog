

JavaScript实现LeetCode第5题：最长回文子串
## 题目描述

给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

示例 1：
```js
输入: "babad"
输出: "bab"
```
注意: "aba" 也是一个有效答案。
示例 2：
```js
输入: "cbbd"
输出: "bb"
```


## 思路

### 1. 中心扩散法：

从每个位置出发，向两边扩散即可。遇到不是回文的时候结束。举个例子，str = acdbbdaastr=acdbbdaa 我们需要寻找从第一个 b（位置为 33）出发最长回文串为多少。怎么寻找？
首先往左寻找与当前位置相同的字符，直到遇到不相等为止。
然后往右寻找与当前位置相同的字符，直到遇到不相等的为止。
最后左右双向扩散，直到左和右不相等。

![中心扩散法](https://pic.leetcode-cn.com/2f205fcd0493818129e8d3604b2d84d94678fda7708c0e9831f192e21abb1f34.png)

每个位置向两边扩散都会出现一个窗口大小（len)。如果 len > maxLen(用来表示最长回文子串的长度)。则更新 maxLen的值。
最后要求返回的是具体子串，而不是长度，所以要记录 maxLen 的起始位置(maxStart)，即此时还要 maxStart=left;

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if(!s) {
        return '';
    }
    let strLen = s.length;
    // 从中间向左右两边遍历
    let left = 0;
    let right = 0;
    // 遍历到当前的长度
    let len = 1;
    // 用来表示最长回文串的长度
    let maxLen = 0;
    // 最后要求返回的是具体子串，而不是长度，所以要记录 maxLen 的起始位置(maxStart)
    let maxStart = 0;
    for(let i = 0; i < strLen; i++) {
        left = i - 1;
        right = i + 1;
        while(left >= 0 && s[i] === s[left]) {
            len++;
            left --;
        }
        while(right < strLen && s[i] === s[right]) {
            len++;
            right++;
        }
        while(left >= 0 && right < strLen && s[left] === s[right]) {
            len+=2;
            left--;
            right++;
        }
        if(len > maxLen) {
            maxLen = len;
            maxStart = left;
        }
        len = 1;
    }
    // maxStart + 1而不是  maxStart ，是因为上传每次while循环后，left都会执行 -- 操作
    return s.substring(maxStart + 1, maxStart + maxLen + 1);

};
```

- 时间复杂度：O(n^2)，由于围绕中心来扩展回文会耗去 O(n)O(n) 的时间，所以总的复杂度为 O(n^2)
- 空间复杂度：O(1)O(1)。

### 2. 动态规划法
用 boolean dp[l][r] 表示从 l 到 r 这段是否为回文。试想如果 dp[l][r] = true，如果要判断 dp[l-1][r+1]是否为回文。只需要判断字符在 (l-1)和(r+1)两个位置是否为相同的字符，是不是减少了很多计算;

动态规划关键是找到初始状态和状态转移方程。
初始状态，l = r 时，此时 dp[l][r] = true
状态转移方程， dp[l][r] = true 并且 (l - 1)和 (r + 1)两个位置为相同的字符，此时 dp[l - 1][r + 1] = true;

```js
/**
 * @param {string} s
 * @return {string}
 */
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if(!s || s.length < 2) {
        return s;
    }
    let strLen = s.length;
    // 最长回文串的起点
    let maxStart = 0;
    // 最长回文串的终点
    let maxEnd = 0;
    // 最长回文串的长度
    let maxLen = 1;

    let dp = Array.from(new Array(strLen),() => new Array(strLen).fill(false));
    for(let r = 1; r < strLen; r++) {
        for(let l = 0; l < r; l++) {
            // r-l <= 2 为了兼容 aa（r-l=1）和aba（r-l=2）这两种回文串
            if(s[l] === s[r] && (r-l <= 2 || dp[l + 1][r - 1])) {
                dp[l][r] = true;
                // 如果 此时的长度 > maxLen, 则更新 maxLen的值。
                if(r - l + 1 > maxLen) {
                    maxLen = r - l + 1;
                    maxStart = l;
                    maxEnd = r;
                }
            }
        }
    }
    return s.substring(maxStart, maxEnd + 1);

};
```
尝试了一下，花费的时间比第一个的中心拓展法要多，还待研究。

### Manacher(马拉车)算法

一个复杂度为 O(n) 的 Manacher 算法.

该算法暂时还没完全搞懂，可以去网上搜一下很多讲解。

## 参考
- [有什么浅显易懂的Manacher Algorithm讲解？](https://www.zhihu.com/question/37289584?sort=created)
- [leetcode官方题解](https://leetcode-cn.com/problems/longest-palindromic-substring/solution/5-zui-chang-hui-wen-zi-chuan-by-alexer-660/)


