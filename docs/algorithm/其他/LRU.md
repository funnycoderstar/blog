## 题目
https://leetcode-cn.com/problems/lru-cache/
## 思路
1.使用Map记录缓存值,使用链表记录缓存操作顺序,最后操作的缓存放在链表头部,链表尾部就是最少操作的缓存

2.读取缓存时,更新缓存操作顺序,将缓存节点从链表中移除, 再将其添加到链表头部, 移除节点时要保证链表的连续性,为了在 `O(1)`时间完成该操作,需要使用双向链表

3.设置缓存时
   - 如果是已存在的缓存,则直接更新缓存值即可,并更新缓存操作的顺序;
   - 如果是不存在的缓存,则将缓存加到链表头部, 添加后如果缓存超出上限, 则将链表尾部的缓存清掉
## 代码
```js
class DoubleLinkList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    /**
     * 链表头部插入
     * 1.如果头部和尾部都存在, 则直接在头部之前插入
     *     修改原来head的prev指向当前node, node的next指向原先的head, node的prev设置为null修改head为当前node
     * 2.如果头部或尾部不存在, 则设置当前node为head和tail
     *     node的next指向null, node的prev设置为nul
     */
    unshift(node) {
         
        if (this.head && this.tail) {
            node.prev = null;
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        } else {
            node.prev = node.next = null;
            this.head = this.tail = node;
        }

        this.length++;
        return node;
    /**
     * 链表尾部删除
     * 1.判断tail是否存在
     * 2.判断head和tail是否相等
     *    相等: this.head = this.tail = null;
     *    不相等: this.tail.prev.next = null; this.tail = this.tail.prev;
     */
    pop() {
        if (this.tail) {
            const node = this.tail;
            if (this.head === this.tail) {
                this.head = this.tail = null;
            } else {
                this.tail.prev.next = null;
                this.tail = this.tail.prev;
            }
            this.length--;
            return node;
        }
    }
    /**
     * 删除具体的某个节点
     * 1.node等于head
     * 2.node等于tail
     * 3.node即不等于head, 也不等于tail
     */
    remove(node) {
        if (node !== this.head && node !== this.tail) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        if (node === this.head) {
            this.head = this.head.next;
        }
        if (node === this.tail) {
            this.tail = this.tail.prev;
        }
        this.length--;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.list = new DoubleLinkList();
        this.map = new Map();
    }

    get(key) {
        let node = this.map.get(key);
        if (node) {
            this.list.remove(node);
            this.list.unshift(node);
            return node.value;
        } else {
            return -1;
        }
    }

    put(key, value) {
        let node = this.map.get(key);
        if (node) {
            node.value = value;
            this.list.remove(node);
            this.list.unshift(node);
        } else {
            node = { key, value };
            this.list.unshift(node);
            this.map.set(key, node);
            if (this.list.length > this.capacity) {
                const tail = this.list.pop();
                this.map.delete(tail.key);
            }
        }
    }
}
```