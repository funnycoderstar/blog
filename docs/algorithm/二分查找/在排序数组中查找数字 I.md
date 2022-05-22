### 剑指 Offer 53 - I. 在排序数组中查找数字 I

统计一个数字在排序数组中出现的次数。

示例 1:

输入: nums = [5,7,7,8,8,10], target = 8
输出: 2
示例  2:

输入: nums = [5,7,7,8,8,10], target = 6
输出: 0

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

### 思路解析

关键词：排序数组，可以使用二分查找。
所以该题可以转换为求排序数组的左边界 left，和右边界 right，最后结果为 right - left + 1。

```js
// 寻找左边界
function findTargetLeft(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) {
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    // 返回值的处理逻辑，判断是否超出边界
    if (left >= nums.length || nums[left] !== target) {
        return -1;
    }
    return left;
}
// 寻找右边界
function findTargetRight(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) {
            left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    // 返回值的处理逻辑，判断是否超出边界
    if (right < 0 || nums[right] !== target) {
        return -1;
    }
    return right;
}
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    const left = findTargetLeft(nums, target);
    const right = findTargetRight(nums, target);
    if (left === -1 && right === -1) {
        return 0;
    }
    return right - left + 1;
};
```
