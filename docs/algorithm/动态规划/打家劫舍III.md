JavaScript实现leetcode337. 打家劫舍 III

## 题目描述
在上次打劫完一条街道之后和一圈房屋后，小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为“根”。 除了“根”之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。

计算在不触动警报的情况下，小偷一晚能够盗取的最高金额。

示例 1:
```js
输入: [3,2,3,null,3,null,1]

     3
    / \
   2   3
    \   \ 
     3   1

输出: 7 
解释: 小偷一晚能够盗取的最高金额 = 3 + 3 + 1 = 7.
```
示例 2:
```js
输入: [3,4,5,1,3,null,1]

     3
    / \
   4   5
  / \   \ 
 1   3   1

输出: 9
解释: 小偷一晚能够盗取的最高金额 = 4 + 5 = 9.
```

## 解题方法

### 解法一：暴力递归 - 最优子结构

我们使用爷爷，两个孩子，4个孙子来说明问题

爷爷节点如何获取到最大的偷取的钱数：
1. 首先要明确相邻的节点不能偷，也就是爷爷选择偷，儿子就不能偷了，但是孙子可以偷
2. 二叉树只有左右两个孩子，一个爷爷最多 2 个儿子，4 个孙子

根据以上条件，我们可以得出单个节点的钱该怎么算
4 个孙子偷的钱 + 爷爷的钱 VS 两个儿子偷的钱 哪个组合钱多，就当做当前节点能偷的最大钱数。这就是动态规划里面的最优子结构

由于是二叉树，这里可以选择计算所有子节点:
1. 4 个孙子偷的钱加上爷爷的钱如下
```js
let method1 = root.val + rob(root.left.left) + rob(root.left.right) + rob(root.right.left) + rob(root.right.right);
```
2. 两个儿子偷的钱如下
```js
let method2 = rob(root.left) + rob(root.right);
```
3. 挑选一个钱数多的方案
```js
let result = Math.max(method1, method2)
```
将上述方案写成代码如下：
```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
    if(root === null) {
        return 0;
    }
    // money对应上面的method1，用来存储 4个孙子偷的钱加上爷爷的钱
    let money = root.val;
    if(root.left !== null) {
        money += (rob(root.left.left) + rob(root.left.right));
    }
    if(root.right !== null) {
        money += (rob(root.right.left) + rob(root.right.right));
    }
    // 其中money对应上面的method1, rob(root.left) + rob(root.right)对应上面的method2
    return Math.max(money, rob(root.left) + rob(root.right));
};
```
这种解法虽然可以解决问题，但是速度太慢, 原因在于：爷爷在计算自己能偷多少钱的时候，同时计算了 4 个孙子能偷多少钱，也计算了 2 个儿子能偷多少钱。这样在儿子当爷爷时，就会产生重复计算一遍孙子节点。

### 解法二：记忆化 - 解决重复子问题

解法一中有一些重复计算的问题，回想一下之前在 解决[斐波那契数列](./斐波那契数列.md)的问题时，也是有重复计算的问题，当时是用数组解决的，把每次计算的结果都存起来，下次如果再来计算，就从缓存中取，不再计算了，这样就保证每个数字只计算一次。由于二叉树不适合拿数组当缓存，我们这次使用 `Map` 来存储结果，TreeNode 当做 key，能偷的钱当做 value。

优化后的代码如下：

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
    let map = new Map();
    return robInternal(root, map);

    function robInternal(root, map) {
        if(root === null) {
            return 0;
        }
        // 当前节点计算过，就直接返回
        if(map.has(root)) {
            return map.get(root);
        }
        let money = root.val;
        if(root.left !== null) {
            money += (robInternal(root.left.left, map) + robInternal(root.left.right, map));
        }
        if(root.right !== null) {
            money += (robInternal(root.right.left, map) + robInternal(root.right.right, map));
        }
        let result = Math.max(money, robInternal(root.left, map) + robInternal(root.right, map));
        // 把当前计算的结果存储到 Map中
        map.set(root, result);
        return result;
    }
};
```


### 解法三
每个节点可选择偷或者不偷两种状态，根据题目意思，相连节点不能一起偷
- 当前节点选择偷时，那么两个孩子节点就不能选择偷了
- 当前节点选择不偷时，两个孩子节点只需要拿最多的钱出来就行(两个孩子节点偷不偷没关系)

我们使用一个大小为 2 的数组来表示 `let result = [0, 0]`, 0 代表不偷，1 代表偷

**任何一个节点能偷到的最大钱的状态可以定义为**

1. 当前节点选择不偷：当前节点能偷到的最大钱数 = 左孩子能偷到的钱 + 右孩子能偷到的钱
2. 当前节点选择偷：当前节点能偷到的最大钱数 = 左孩子选择自己不偷时能得到的钱 + 右孩子选择不偷时能得到的钱 + 当前节点的钱数

表示为公式如下
```js
// result[0]：以当前 node 为根结点的子树能够偷取的最大价值，规定 node 结点不偷
// result[1]：以当前 node 为根结点的子树能够偷取的最大价值，规定 node 结点偷
result[0] = Math.max(rob(root.left)[0], rob(root.left)[1]) + Math.max(rob(root.right)[0], rob(root.right)[1]);
result[1] = rob(root.left)[0] + rob(root.right)[0] + root.val;
```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
    let result = robInternal(root);
    return Math.max(result[0], result[1]);

    function robInternal(root) {
        if(root === null) {
            return [0, 0];
        }
        // 初始化大小为2的数组，第0个代表不偷，第1位代表偷
        let result = [0, 0];
        let left = robInternal(root.left);
        let right = robInternal(root.right);
        // result[0]：以当前 node 为根结点的子树能够偷取的最大价值，规定 node 结点不偷
        // result[1]：以当前 node 为根结点的子树能够偷取的最大价值，规定 node 结点偷
        result[0] = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        result[1] = left[0] + right[0] + root.val;

        return result;
    }
};
```

## 参考
- [Leetcode题解之三种方法解决树形动态规划问题-从入门级代码到高效树形动态规划代码实现](https://leetcode-cn.com/problems/house-robber-iii/solution/san-chong-fang-fa-jie-jue-shu-xing-dong-tai-gui-hu/)
