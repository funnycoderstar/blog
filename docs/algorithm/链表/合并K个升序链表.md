### 方法一：利用合并两个升序链表的方式

1. 顺序合并

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    const mergeTwoList = function(list1, list2) {
        let dummy = new ListNode(-1);
        let cur = dummy;
        while (list1 && list2) {
            if (list1.val < list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        cur.next = list1 ? list1 : list2;
        return dummy.next;
    };
    // 利用合并两个升序链表的方式两两合并
    let ans = null;
    for (let i = 0; i < lists.length; i++) {
        ans = mergeTwoList(ans, lists[i]);
    }
    return ans;
};
```

-   时间复杂度： O(k^2 \* n)

2. 分治合并

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    const mergeTwoList = function(list1, list2) {
        let dummy = new ListNode(-1);
        let cur = dummy;
        while (list1 && list2) {
            if (list1.val < list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        cur.next = list1 ? list1 : list2;
        return dummy.next;
    };
    const mergeSort = function(lists) {
        if (lists.length <= 1) {
            return lists[0] || null;
        }
        let mid = Math.floor(lists.length / 2);
        let leftArr = lists.slice(0, mid);
        let rightArr = lists.slice(mid);
        return mergeTwoList(mergeSort(leftArr), mergeSort(rightArr));
    };
    return mergeSort(lists);
};
```

-   时间复杂度： O(kn×logk)
-   空间复杂度：递归会使用到 O(logk) 空间代价的栈空间。

### 方法二：优先队列

这里可以使用最小堆。思路如下

1. 新链表的下一个节点一定是 k 个链表头中的最小节点
2. 选择使用最小堆
