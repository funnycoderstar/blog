## 题目描述

在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

示例 1:

```js
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
```

示例  2:

```js
输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
```

说明:

-   你可以假设 k 总是有效的，且 1 ≤ k ≤ 数组的长度。

## 思路

直接使用数组的 sort方法的暂时就不说了，下面介绍一下构建最小堆和快排。
### 构建最小堆

#### 最大堆和最小堆

当父节点的键值总是大于或等于任何一个子节点的键值是最大堆。
当父节点的键值总是小于或等于任何子节点的键值时为最小堆。

```js
最大堆(又叫大顶堆)：

   100
   / \
  19   36
 / \   / \
17  3 25  1

最小堆(又叫大顶堆)：
    1
   / \
  2     3
 / \   / \
17  19 36  7

```

js 中以 0 作为数组的索引

-   i 的父节点为 `Math.floor((i-1) / 2)`
-   i 的左子节点为 `nLeftIndex = 2 * i + 1`;
-   i 的右子节点为 `nRightIndex = 2 * i + 2`;

数组 [3, 5, 1, 6, 7, 2 ] 转成二叉树如下

```js
     3(0)
   /      \
  5(1)     1(2)
 /   \     /  \
6(3) 4(4) 7(5) 2(6)
```
其中()中的数字是数组下标

#### 回到本题

利用小顶堆的特性（堆顶元素最小），先对前 k 个数组元素进行 "原地"建最小堆，建完小顶堆后，堆顶的元素最小，正好是这 K 个元素的第 K 大元素
然后遍历剩下的元素 nums[k] ~ nums[len - 1]

1. 如果比堆顶元素小，跳过
2. 如何比堆顶元素大，和堆顶元素交换后重新堆化

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const findKthLargest = function(nums, k) {
    // 初始化一个堆数组
    const heap = [];
    // n表示堆数组里当前最后一个元素的索引
    let n = 0;
    // 缓存 nums 的长度
    const len = nums.length;
    // 初始化大小为 k 的堆
    function createHeap() {
        for (let i = 0; i < k; i++) {
            // 逐个往堆里插入数组中的数字
            insert(nums[i]);
        }
    }

    // 尝试用 [k, n-1] 区间的元素更新堆
    function updateHeap() {
        for (let i = k; i < len; i++) {
            // 只有比堆顶元素大的才有资格进堆
            if (nums[i] > heap[0]) {
                // 用较大数字替换堆顶数字
                heap[0] = nums[i];
                // 重复向下对比+交换的逻辑
                downHeap(0, k);
            }
        }
    }

    // 向下对比函数
    function downHeap(low, high) {
        // 入参是堆元素在数组里的索引范围，low表示下界，high表示上界
        let i = low,
            j = i * 2 + 1;
        // 当 j 不超过上界时，重复向下对比+交换的操作
        while (j <= high) {
            // // 如果右孩子比左孩子更小，则用右孩子和根结点比较
            if (j + 1 <= high && heap[j + 1] < heap[j]) {
                j = j + 1;
            }

            // 若当前结点比孩子结点大，则交换两者的位置，把较小的结点“拱上去”
            if (heap[i] > heap[j]) {
                // 交换位置
                const temp = heap[j];
                heap[j] = heap[i];
                heap[i] = temp;

                // i 更新为被交换的孩子结点的索引
                i = j;
                // j 更新为孩子结点的左孩子的索引
                j = j * 2 + 1;
            } else {
                break;
            }
        }
    }

    // 入参是堆元素在数组里的索引范围，low表示下界，high表示上界
    function upHeap(low, high) {
        // 初始化 i（当前结点索引）为上界
        let i = high;
        // 初始化 j 为 i 的父结点
        let j = Math.floor((i - 1) / 2);
        // 当 j 不逾越下界时，重复向上对比+交换的过程
        while (j >= low) {
            // 若当前结点比父结点小
            if (heap[j] > heap[i]) {
                // 交换当前结点与父结点，保持父结点是较小的一个
                const temp = heap[j];
                heap[j] = heap[i];
                heap[i] = temp;

                // i更新为被交换父结点的位置
                i = j;
                // j更新为父结点的父结点
                j = Math.floor((i - 1) / 2);
            } else {
                break;
            }
        }
    }

    // 插入操作=将元素添加到堆尾部+向上调整元素的位置
    function insert(x) {
        heap[n] = x;
        upHeap(0, n);
        n++;
    }

    // 调用createHeap初始化元素个数为k的队
    createHeap();
    // 调用updateHeap更新堆的内容，确保最后堆里保留的是最大的k个元素
    updateHeap();
    // 最后堆顶留下的就是最大的k个元素中最小的那个，也就是第k大的元素
    return heap[0];
};
```
- 时间复杂度 : O(Nlogk)。
- 空间复杂度 : O(k)，用于存储堆元素。


### 快排

1. 用数组第一个数为基准，左边的都比arr[0] 大，右边的都比 arr[0] 小
2. 如果 left.length + 1 == k, 说明 基准是第k大的数
3. 如果 left.length >= k， 说明第k大的数在 left 中
4. 否则，在right中

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    let mid = nums[0];
    let left = [];
    let right = [];
    for(let i = 1; i < nums.length; i++) {
        if (nums[i] > mid) {
            left.push(nums[i]);
        } else {
            right.push(nums[i]);
        }
    }
    if (left.length + 1 === k) {
        return mid;
    }
    if (left.length + 1 > k ) {
        return findKthLargest(left, k);
    }
    return findKthLargest(right, k - left.length - 1);
};
```

