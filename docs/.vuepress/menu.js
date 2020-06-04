function GeneratorMenu(pathPrefix, pathnameList) {
    let result = [];
    for(let i = 0; i < pathnameList.length; i++) {
        result[i] = [`${pathPrefix}${pathnameList[i]}`, pathnameList[i]];
    }
    return result;
}

const linkList = GeneratorMenu('/algorithm/链表/', [
    '合并两个有序链表',
    '反转链表',
    '回文链表',
    '倒数第K个节点',
    '找出链表的中间节点',
    '两个链表的第一个公共节点',
    'LRU缓存机制',
]);
const JSList = GeneratorMenu('/interview/JavaScript/', [
    '从JS底层理解var,const,let',
    '赋值、浅拷贝、深拷贝区别',
    '函数柯里化',
    '一文理解this&call&apply&bind',
    'typeof和instanceof原理',
    'setTimeout和requestAnimationFrame',
    'for...of原理解析',
    'Generator函数',
    'async原理解析',
    '详解ES6中的class',
    '装饰器',
    'JavaScript的几种创建对象的方式',
    'JavaScript的几种继承方式',
    '事件循环机制',
]);

const VueList = GeneratorMenu('/interview/Vue/', [
    '简单通俗理解vue3.0中的Proxy',
    'keep-alive的实现原理及LRU缓存策略',
    'nextTick的原理及运行机制',
]);
module.exports = {
    linkList,
    JSList,
    VueList,
}

