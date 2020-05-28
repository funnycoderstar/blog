## 题目描述
给定两个数组，编写一个函数来计算它们的交集。

示例 1:
```js
输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2,2]

```
示例 2:
```js
输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出: [4,9]
```
说明：

输出结果中每个元素出现的次数，应与元素在两个数组中出现的次数一致。
我们可以不考虑输出结果的顺序。
进阶:

- 如果给定的数组已经排好序呢？你将如何优化你的算法？
- 如果 nums1 的大小比 nums2 小很多，哪种方法更优？
- 如果 nums2 的元素存储在磁盘上，磁盘内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？

## 解题思路
幼稚的方法是根据第一个数组 nums1 迭代并检查每个值是否存在在 nums2 内。如果存在将值添加到输出。这样的方法会导致 O(nxm) 的时间复杂性，其中 n 和 m 是数组的长度。O(n^2)

### 使用 Map
在 实现349.两个数组的交集，我们使用 Set来实现线性时间复杂度，在这里我们要使用 Map 来跟踪每个数字出现的次数

1. 现在 Map 中记录一个数组中的存在的数字和对应的次数,
2. 然后,我们遍历第二个数组,检查数字在 Map中是否存在, 如果存在且计数为正，且将该数字添加到答案并减少  map 中的计数

检查数组的大小并对较小的数组进行哈希映射是一个小细节，当其中一个数组较大时，会减少内存的使用。
```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {

    const map = new Map();
    let result = [];
    for(let i = 0; i < nums1.length; i++) {
        let value = map.get(nums1[i]);
        if(value) {
            map.set(nums1[i], ++value);
        } else {
             map.set(nums1[i], 1);
        }
    }
    for(let i = 0; i < nums2.length; i++) {
        let value = map.get(nums2[i]);
        if(value >= 1) {
            map.set(nums2[i], --value);
            result.push(nums2[i])
        }
    }
    return result;
};
```

## 进阶三问：

问题1：如果给定的数组已经排好序呢？你将如何优化你的算法？
将两个数组进行排序，然后用双指针顺序查找相同的元素
时间复杂度O(max(nlogn, mlogm, n+m))，空间复杂度O(1) (n,m分别为两个数组的长度)

如果是进阶问题一中已排序的数组，则只需O(n)的时间复杂度
```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    function compare(a, b) {
        return a - b;
    }
    nums1.sort(compare);
    nums2.sort(compare);

    let i = 0;
    let j = 0;
    const result = [];
    while(i < nums1.length && j < nums2.length) {
        if(nums1[i] < nums2[j]) {
            ++i;
        } else if(nums1[i] > nums2[j]) {
            ++j;
        } else {
           result.push(nums1[i]);
            ++i;
            ++j;
        }
    }
    return result;
}; 
```
问题2：
如果 nums1 的大小比 nums2 小很多，哪种方法更优？
将较小的数组哈希计数，随后在另一个数组中根据哈希来寻找。
时间复杂度O(max(n, m)) 空间复杂度O(min(n, m))

问题3：
如果内存十分小，不足以将数组全部载入内存，那么必然也不能使用哈希这类费空间的算法，只能选用空间复杂度最小的算法，即双指针解法。


## 参考
[Leetcode350. 两个数组的交集 II ](https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/solution/liang-ge-shu-zu-de-jiao-ji-ii-by-leetcode/)