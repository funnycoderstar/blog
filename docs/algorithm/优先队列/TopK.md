## 题目

-   [剑指 Offer 40. 最小的 k 个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)
-   [215. 数组中的第 K 个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)
-   [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)
-   [703. 数据流中的第 K 大元素](https://leetcode.cn/problems/kth-largest-element-in-a-stream/)
-   [中位数]

### 最小的 k 个数

构建最小堆，个数为 k，每次取堆顶，然后再堆化
怎么控制个数为 K 呢

### 数组中的第 K 个最大元素

构建最小堆，个数为 K，堆顶就是结果。
数组大小为 n, 怎么构建个数为 K 的最小堆呢

解法一：构建最小堆

构建大小为 k 的最小堆

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    function swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]];
    }
    // 对于节点 i 做 heapify
    function heapify(array, heapSize, i) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let minIndex = i;
        if (left < heapSize && array[left] < array[minIndex]) {
            minIndex = left;
        }
        if (right < heapSize && array[right] < array[minIndex]) {
            minIndex = right;
        }
        if (minIndex !== i) {
            swap(array, minIndex, i);
            heapify(array, heapSize, minIndex);
        }
    }
    function buildMinHeap(array, heapSize) {
        let lastIndex = heapSize - 1;
        let parent = Math.floor((lastIndex - 1) / 2);
        for (let i = parent; i >= 0; i--) {
            heapify(array, heapSize, i);
        }
    }

    // 构建大小为k的最小堆
    let heap = nums.slice(0, k);
    buildMinHeap(heap, k);
    // 和堆排序不同的点
    for (let i = k; i < nums.length; i++) {
        if (nums[i] > heap[0]) {
            // 替换并堆化
            heap[0] = nums[i];
            heapify(heap, k, 0);
        }
    }
    return heap[0];
};
```

原地建立个数为 K 最小堆

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    // 前K个元素原地建小顶堆
    buildHeap(nums, k);
    // 遍历剩下元素，比堆顶小，跳过；比堆顶大，交换后重新堆化
    for (let i = k; i < nums.length; i++) {
        if (nums[i] < nums[0]) {
            continue;
        }
        [nums[i], nums[0]] = [nums[0], nums[i]];
        heapify(nums, k, 0);
    }
    // K个元素的小顶堆的堆顶即是第K大元素
    return nums[0];
    /**
     * 建堆函数
     * 从倒数第一个非叶子节点开始堆化，倒数第一个非叶子节点下标为 K/2-1
     */
    function buildHeap(nums, k) {
        for (let i = k / 2 - 1; i >= 0; i--) {
            heapify(nums, k, i);
        }
    }
    /**
     * 堆化函数
     * 父节点下标i，左右子节点的下标分别为 2*i+1 和 2*i+2
     */
    function heapify(nums, k, i) {
        // 临时变量 minPos 用于存储最小值的下标，先假设父节点最小
        let minPos = i;
        while (true) {
            // 和左子节点比较
            if (i * 2 + 1 < k && nums[i * 2 + 1] < nums[i]) {
                minPos = i * 2 + 1;
            }
            // 和右子节点比较
            if (i * 2 + 2 < k && nums[i * 2 + 2] < nums[minPos]) {
                minPos = i * 2 + 2;
            }
            // //如果minPos没有发生变化，说明父节点已经是最小了，直接跳出
            if (minPos === i) {
                break;
            }
            // 否则交换
            [nums[i], nums[minPos]] = [nums[minPos], nums[i]];

            i = minPos;
        }
    }
};
```

解法二：使用堆排序（最大堆）

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    function swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]];
    }
    // 对于节点 i 做 heapify
    function heapify(array, heapSize, i) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let largest = i;
        if (left < heapSize && array[left] > array[largest]) {
            largest = left;
        }
        if (right < heapSize && array[right] > array[largest]) {
            largest = right;
        }
        if (largest !== i) {
            swap(array, largest, i);
            heapify(array, heapSize, largest);
        }
    }
    function buildMaxHeap(array, heapSize) {
        let lastIndex = heapSize - 1;
        let parent = Math.floor((lastIndex - 1) / 2);
        for (let i = parent; i >= 0; i--) {
            heapify(array, heapSize, i);
        }
    }

    let heapSize = nums.length;
    buildMaxHeap(nums, heapSize);
    for (let i = heapSize - 1; i >= nums.length - k + 1; i--) {
        swap(nums, i, 0);
        --heapSize;
        heapify(nums, heapSize, 0);
    }
    return nums[0];
};
```

## 703. 数据流中的第 K 大元素

思路一：排序
每次都进行排序，获取第 K 大的元素
思路二：优先队列，使用小顶堆

```js
```

> 面试题频次：「数据流中的 TopK」亚马逊面试遇到过的真题, 实现堆算法在微软面试遇到的真题，TopK 算法在面试中常问。
