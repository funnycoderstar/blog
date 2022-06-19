[剑指 Offer 57 - II. 和为 s 的连续正数序列](https://leetcode.cn/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

示例 1：

输入：target = 9
输出：[[2,3,4],[4,5]]
示例 2：

输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 解法

双指针（滑动窗口）

```js
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
    let left = 1;
    let right = 2;
    let sum = 3;
    let result = [];
    while (left < right) {
        if (sum === target) {
            // 将 此时 left -> right的连续子串存储起来，放到结果中
            let ans = [];
            for (let k = left; k <= right; k++) {
                ans[k - left] = k;
            }
            result.push(ans);
            // 等于的情况，我们可以继续窗口往右搜索，同时缩小左边的
            sum = sum - left;
            left++;
        } else if (sum > target) {
            // 大于时：缩小窗口（缩短左边界）
            sum = sum - left;
            left++;
        } else {
            // 小于时：继续扩大窗口
            right++;
            sum = sum + right;
        }
    }
    return result;
};
```
