https://leetcode.cn/problems/fu-za-lian-biao-de-fu-zhi-lcof/

```js
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function(head) {
    if (!head) {
        return null;
    }
    // 将新节点复制到map中
    let map = new Map();
    let node = head;
    while (node) {
        map.set(node, new Node(node.val));
        node = node.next;
    }
    // 对map中存储的节点做遍历操作
    node = head;
    while (node) {
        map.get(node).next = map.get(node.next) == undefined ? null : map.get(node.next);
        map.get(node).random = map.get(node.random);
        node = node.next;
    }
    return map.get(head);
};
```
