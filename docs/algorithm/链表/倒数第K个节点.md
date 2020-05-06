## 倒数第K个节点

1. 初始化: 使用双指针，i, j
2. 构建双指针距离: 先将i向后移动k次，此时 i，j的距离为k
3. 双指针共同移动: 同时移动i，j，直到i指向 null，此时j位置的val就是答案
3. 返回值

![img](https://pic.leetcode-cn.com/c11759b47df01442d2bacdc3a693531e1c5e905c741307f4bf61efffb08ce15d-aa.png)
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {number}
 */
var kthToLast = function(head, k) {
    let p = head;
    for(let i = 0; i < k; i++) {
        p = p.next;
    }
    while(p) {
        p = p.next;
        head = head.next;
    }
    return head.val;
};
```