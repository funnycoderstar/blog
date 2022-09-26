BFS 核心思想：
使用【队列】这种数据结构，每次将一个节点周围的所有节点加入队列

BFS 和 DFS 的主要区别：BFS 找到的路径一定是最短的，但代价就是空间复杂度可能比 DFS 大很多。

BFS: 本质上就是一幅「图」，让你从一个起点，走到终点，问最短路径
BFS 的框架

```js
// 计算从起点 start 到终点 target 的最近距离
function BFS( start,  target) {
    let queue = []; // 核心数据结构
    let visited = new Set(); // 避免走回头路

    queue.push(start); // 将起点加入队列
    visited.add(start);
    let step = 0; // 记录扩散的步数

    while (queue.length !== 0) {
        let  sz = queue.length;
        /* 将当前队列中的所有节点向四周扩散 */
        for (let i = 0; i < sz; i++) {
           let cur = queue.shift();
            /* 划重点：这里判断是否到达终点 */
            if (cur === target)
                return step;
            /* 将 cur 的相邻节点加入队列 */
            for (let x in cur.adj())
                if (x not in visited) {
                    quque.push(x);
                    visited.add(x);
                }
        }
        /* 划重点：更新步数在这里 */
        step++;
    }
}
```

-   队列 queue: BFS 的核心数据结构
-   cur.adj()泛指 cur 相邻的节点，比如说二维数组中，cur 上下左右四面的位置就是相邻节点；
-   visited 的主要作用是防止走回头路，大部分时候都是必须的，但是像一般的二叉树结构，没有子节点到父节点的指针，不会走回头路就不需要 visited。
