
JavaScript实现leetcode234. 回文链表

## 题目描述
请判断一个链表是否为回文链表。

示例 1:
```js
输入: 1->2
输出: false
示例 2:

输入: 1->2->2->1
输出: true
```
进阶：
你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

## 思路分析
避免使用 O(n)额外空间的方法就是改变输入。
我们可以将链表的后半部分反转（修改链表结构），然后将前半部分和后半部分进行比较。

方法步骤：
1. 找到前半部分链表的尾节点。同时反转前半部分链表。
    - 快慢指针在一次遍历中找到：慢指针一次走一步，快指针一次走两步，快慢指针同时出发。当快指针移动到链表的末尾时，慢指针到链表的中间。通过慢指针将链表分为两部分。
    - 若链表有奇数个节点，则中间的节点应该看作是前半部分。
2. 判断是否为回文。
    - 比较两个部分的值，当后半部分到达末尾则比较完成

## 解题方法

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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    if(head === null || head.next === null) {
        return true;
    }
    let mid = head;
    let pre = null;
    let reversed = null;
    // 快慢指针找出中间节点
    while(head !== null && head.next !== null) {
        pre = mid;
        mid = mid.next;
        head = head.next.next;
        // 反转前半段
        pre.next = reversed;
        reversed = pre;
    }
    // 如果是奇数个
    if(head) {
        mid = mid.next;
    }
    // 将反转完之后的前半段和后半段做对比
    while(mid) {
        if(reversed.val !== mid.val) {
            return false;
        }
        reversed = reversed.next;
        mid = mid.next;
    }
    return true;
};
```
## 复杂度分析

- 时间复杂度：O(n)，其中 nn 指的是链表的大小。
- 空间复杂度：O(1)，我们是一个接着一个的改变指针，我们在堆栈上的堆栈帧不超过 O(1)。