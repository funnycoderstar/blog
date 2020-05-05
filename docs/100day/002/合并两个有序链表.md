# 合并两个有序链表

JavaScript实现LeetCode第21题：合并两个有序链表

## 题目描述

将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
示例：
```js
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```
## 思路分析
新建一个链表，然后比较两个链表中的元素值，把较小的那个链到新链表中，由于两个输入链表的长度可能不同，所以最终会有一个链表先完成插入所有元素，则直接另一个未完成的链表直接链入新链表的末尾。

## 解法
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
    let res = new ListNode(-1);
    let cur = res;
    while(l1 !== null && l2 !== null) {
        if (l1.val < l2.val){
            cur.next = l1;
            l1 = l1.next;
        } else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = (l1 === null) ? l2 : l1;
    return res.next;
};
```