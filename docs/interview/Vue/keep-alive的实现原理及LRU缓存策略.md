## keep-alive 用法

我们先来看看 官方文档中[keep-alive](https://cn.vuejs.org/v2/api/#keep-alive) 的用法。

```html
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```
- props:
  - include：只有名称匹配的组件才会被缓存
  - exclude: 任何名称匹配的组件都不会被缓存
  - max: 最多可以缓存多少组件实例。(2.5.0 新增, 一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉)

- 用法
  - keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁他们。
  - 当组件在  keep-alive 内被切换， 它的 activated 和 deactivated 两个生命周期钩子函数将会被执行。

## 实现原理

### 源码解析
`<keep-alive>`是vue源码中实现的一个组件， 我们可以从源码入手进行分析，基于vue 2.6.11 版本, 源码位置[src/core/components/keep-alive.js](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js)
```js
// <keep-alive> 组件的实现也是一个对象
export default {
  name: 'keep-alive',
  // 抽象组件
  abstract: true,

  props: {
    // 只有名称匹配的组件才会被缓存
    include: patternTypes,
    // 任何名称匹配的组件都不会被缓存
    exclude: patternTypes,
    // 缓存组件的最大数量, 因为我们缓存的是vnode对象，它也会持有DOM，当我们缓存很多的时候，会比较占用内存，所以该配置允许我们指定缓存大小
    max: [String, Number]
  },

  created () {
    // 初始化存储缓存的cache对象和缓存 vNode 键的数组
    this.cache = Object.create(null)
    this.keys = []
  },

  //  destroyed 中销毁所有cache中的组件实例
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 监听 include 和 exclude的变化，在变化的时候重新调整 cache的内容
    // 其实就是对 cache 做遍历，发现缓存的节点名称和新的规则没有匹配上的时候，就把这个缓存节点从缓存中摘除
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  // 自定义render函数
  render () {
    /*
    * 获取第一个子元素的 vnode
    * 由于我们也是在 <keep-alive> 标签内部写 DOM，所以可以先获取到它的默认插槽，然后再获取到它的第一个子节点。<keep-alive> 只处理第一个子元素，所以一般和它搭配使用
    * 的有 component 动态组件或者是 router-view，这点要牢记。
    */
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 判断当前组件名称和 include、exclude 的关系：
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this

      // matches就是做匹配，分别处理了数组、字符串、正则表达式的情况
      // 组件名如果满足了配置 include 且不匹配或者是配置了 exclude 且匹配，那么就直接返回这个组件的 vnode，否则的话走下一步缓存：
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      // 如果命中缓存，则直接从缓存中拿 vnode 的组件实例，并且重新调整了 key 的顺序放在了最后一个
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        // 使用 LRU 缓存策略，把key移除，同时加在最后面
        remove(keys, key)
        keys.push(key)
      } else {
        // 没有命中缓存，则把 vnode设置进缓存
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        // 配置了max 并且缓存的长度超过了 this.max，则要从缓存中删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          // 除了从缓存中删除外，还要判断如果要删除的缓存并的组件 tag 不是当前渲染组件 tag，也执行删除缓存的组件实例的 $destroy 方法。
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      // keepAlive标记位
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}


function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

```
#### 1. 判断当前组件是否要被缓存
获取 keep-alive 包裹的第一个子组件对象及其组件名，根据设置的 include/exclude(如果有)进行条件匹配，决定是否缓存。如果不匹配，则直接返回组件实例

#### 2. 命中缓存则直接获取，同时更新key的位置
根据组件id和tag生成缓存 key，并在缓存对象中查找是否已缓存过该组件实例对象，如果存在，直接取出缓存值并更新该key在this.keys中的位置（更新key的位置是实现LRU置换策略的关键）

#### 3. 不命中缓存则设置进缓存，同时检查缓存的实例数量是否超过 max
在this.cache对象中存储该组件实例并保存 key 值，之后检查缓存的实例数量是否超过 max的设置值，超过 max 的设置值，超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为0的那个key）

#### 4. 将当前组件实例的 keepAlive 属性设置为true，这个在缓存选中过程中会用到。

### abstract（抽象组件）
最开始设置的 abstract 属性 值为 true，是一个抽象组件，文档中提到过：`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

组件一旦被 `<keep-alive>` 缓存，那么再次渲染的时候就不会执行 created、mounted 等钩子函数。但是有些业务场景需要在被缓存的组件重新渲染的时候需要做一些事情，vue则提供了activated 和 deactivated 钩子函数。

vue在初始化生命周期的时候，为组件实例建立父子关系时会根据 abstract 属性决定是否忽略某个组件。在keep-alive中，设置了abstract:true，那Vue就会跳过该组件实例。

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  ...
}
```

### `<keep-alive>`  首次渲染和缓存渲染

首次渲染的时候，除了再 `<keep-alive>`  中建立缓存，设置`vnode.data.keepAlive`为true，其他的过程和普通组件一样。

缓存渲染的时候，会根据 `vnode.componentInstance`（首次渲染vnode.componentInstance 为 undefined） 和 `vnode.data.keepAlive`进行判断不会执行组件的 created、mounted 等钩子函数，而是对缓存的组件执行patch 过程，最后直接把缓存的DOM对象直接插入到目标元素中，完成了数据更新的情况下的渲染过程。

## 缓存策略
LRU缓存策略：从内存中找出最久未使用的数据置换新的数据.
LRU（Least rencently used）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”。

最常见的实现是使用一个链表保存缓存数据，详细算法实现如下：
1. 新数据插入到链表头部
2. 每当缓存命中（即缓存数据被访问），则将数据移到链表头部
3. 链表满的时候，将链表尾部的数据丢弃。


## 总结

- `<keep-alive>` 是一个抽象组件，
    - 首次渲染的时候设置缓存
    - 缓存渲染的时候不会执行组件的 created、mounted 等钩子函数, 而是对缓存的组件执行patch 过程，最后直接更新到目标元素。
- 使用 LRU 缓存策略对组件进行缓存
  - 命中缓存，则直接返回缓存，同时更新缓存key的位置
  - 不命中缓存则设置进缓存，同时检查缓存的实例数量是否超过 max


## 参考
- [vue keep-alive的实现原理和缓存策略](https://www.cnblogs.com/everlose/p/12541934.html)
- [浅析Vue中keep-alive实现原理以及LRU缓存算法](https://segmentfault.com/a/1190000020515898)
- [缓存淘汰算法--LRU算法](https://www.iteye.com/blog/flychao88-1977653)