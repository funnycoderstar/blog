// const menu = require('./menu');
// const {linkList, JSList, VueList} = menu;

function GeneratorMenu(pathPrefix, pathnameList) {
    let result = [];
    for (let i = 0; i < pathnameList.length; i++) {
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
const articles100List = GeneratorMenu('/100day/文章/', [
    '命令行参数',
    '如何启动一个本地静态服务器',
]);
const algorithm100List = GeneratorMenu('/100day/算法题/', [
    '常考算法面试题系列-链表的操作',
    '常考算法面试题系列-树的遍历',
    '二叉树的最大和最小深度',
    '路径总和(I、II、III)',
    '买卖股票的最佳时机',
    '相同的树、对称二叉树、翻转二叉树',
    '路径总和(I、II、III)',
]);

const ArrayList = GeneratorMenu('/algorithm/数组/', [
    '打乱数组',
    '构建乘积数组',
    '使数组唯一的最小增量',
    '扑克牌中的顺子',
    '数组的交集',
    '数组的交集II',
    '数组中的第K个最大元素',
    '合并两个有序数组',
    '全排列',
    '螺旋矩阵',
    '螺旋矩阵II',
    '三数之和',
    '更接近的三数之和',
    '合并区间',
    '区间列表的交集',
    '删除被覆盖区间',
]);
const TreeList = GeneratorMenu('/algorithm/树/', [
    '树的遍历',
    '路径总和',
    '相同的树',
    '对称二叉树',
    '翻转二叉树',
    '另一个树的子树',
    '验证二叉搜索树',
    '二叉树的最大深度',
    '二叉树的最小深度',
    '平衡二叉树',
    '将有序数组转换为二叉搜索树',
    '二叉搜索树迭代器',
    '二叉搜索树的最近公共祖先',
    '二叉树的最近公共祖先',
]);

module.exports = {
    base: '/blog/',
    title: '前端学习总结',
    description: '前端学习总结',
    // theme: 'vuepress-theme-lemon',
    head: [['link', { rel: 'icon', href: 'https://cdn.wangyaxing.cn/icon-128x128.png' }]],
    themeConfig: {
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        nav: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: '算法',
                link: '/algorithm/',
            },
            { text: '编程题', link: '/jsCode/' },
            { text: '前端相关', link: '/interview/' },
            // {
            //     text: '100天',
            //     link: '/100day/',
            // },
            { text: 'Github', link: 'https://github.com/funnycoderstar/blog' },
        ],
        sidebar: {
            '/algorithm/': [
                ['/algorithm/', '算法专题'],
                {
                    title: '树',
                    collapsable: true,
                    children: TreeList,
                },
                {
                    title: '链表',
                    collapsable: true,
                    children: linkList,
                },
                {
                    title: '数组',
                    collapsable: true,
                    children: ArrayList,
                },
                {
                    title: '数学',
                    collapsable: true,
                    children: [
                        ['/algorithm/数学/计算质数', '计算质数'],
                        ['/algorithm/数学/求众数', '求众数'],
                        ['/algorithm/数学/中位数', '中位数'],
                        ['/algorithm/数学/只出现一次的数字', '只出现一次的数字'],
                        ['/algorithm/数学/有效的三角形个数', '有效的三角形个数'],
                    ],
                },
                {
                    title: '动态规划',
                    collapsable: true,
                    children: [
                        ['/algorithm/动态规划/斐波那契数列', '斐波那契数列'],
                        ['/algorithm/动态规划/买卖股票的最佳时机I', '买卖股票的最佳时机I'],
                        ['/algorithm/动态规划/买卖股票的最佳时机II', '买卖股票的最佳时机II'],
                        ['/algorithm/动态规划/盛最多水的容器', '盛最多水的容器'],
                        ['/algorithm/动态规划/接雨水', '接雨水'],
                        ['/algorithm/动态规划/无重复字符的最长子串', '无重复字符的最长子串'],
                        ['/algorithm/动态规划/最大子序和', '最大子序和'],
                        ['/algorithm/动态规划/最长公共前缀', '最长公共前缀'],
                        ['/algorithm/动态规划/最长回文子串', '最长回文子串'],
                        ['/algorithm/动态规划/最长公共子序列', '最长公共子序列'],
                        ['/algorithm/动态规划/最长上升子序列', '最长上升子序列'],
                        ['/algorithm/动态规划/打家劫舍', '打家劫舍'],
                        ['/algorithm/动态规划/打家劫舍II', '打家劫舍 II'],
                        ['/algorithm/动态规划/打家劫舍III', '打家劫舍 III'],
                    ],
                },
            ],
            '/jsCode/': [
                ['/jsCode/', '手写代码系列'],
                ['/jsCode/防抖', '手写一个防抖'],
                ['/jsCode/节流', '手写一个节流'],
                ['/jsCode/浅比较和深比较', '浅比较和深比较'],
                ['/jsCode/浅拷贝和深拷贝', '浅拷贝和深拷贝'],
                ['/jsCode/数组乱序', '数组乱序'],
                ['/jsCode/函数柯里化', '函数柯里化'],
                ['/jsCode/实现一个Promise', '实现一个Promise'],
                ['/jsCode/实现一个new', '实现一个new'],
                ['/jsCode/实现instanceof', '实现instanceof'],
                ['/jsCode/实现flat', '实现flat'],
                ['/jsCode/手写继承', '手写继承'],
                ['/jsCode/实现一个async函数', '实现一个async函数'],
                ['/jsCode/实现一个iterator', '实现一个iterator'],
                ['/jsCode/setTimeout实现setInterval', 'setTimeout实现setInterval'],
                ['/jsCode/限制并发请求', '限制并发请求'],
                ['/jsCode/实现一个repeat方法', '实现一个repeat方法'],
                ['/jsCode/简单实现一个Vue的双向绑定', '简单实现一个Vue的双向绑定'],
                ['/jsCode/实现一个vue自定义指令-懒加载', '实现一个vue自定义指令-懒加载'],
                ['/jsCode/实现一个轮播图', '实现一个轮播图'],
                ['/jsCode/放大镜效果', '放大镜效果'],
                ['/jsCode/LazyMan', '实现一个LazyMan'],
                ['/jsCode/发布-订阅模式的实现', '发布-订阅模式的实现'],
            ],
            '/interview/': [
                ['/interview/', '前端相关'],
                {
                    title: 'CSS',
                    collapsable: true,
                    children: [
                        ['/interview/CSS/CSS基础知识点', 'CSS基础知识点'],
                        ['/interview/CSS/伪类和伪元素', '伪类和伪元素'],
                        ['/interview/CSS/实现固定宽高比的div', '实现固定宽高比的div'],
                        ['/interview/CSS/css解析规则', 'css解析规则'],
                        ['/interview/CSS/CSS选择器', 'CSS选择器'],
                        [
                            '/interview/CSS/display:none和visibility:hidden的区别',
                            'display: none和 visibility:hidden的区别',
                        ],
                        ['/interview/CSS/flex.md', 'flex:1'],
                        ['/interview/CSS/常见CSS布局的实现', '常见CSS布局的实现'],
                    ],
                },
                {
                    title: 'JavaScript',
                    collapsable: true,
                    children: JSList,
                },
                {
                    title: 'Vue',
                    collapsable: true,
                    children: VueList,
                },
                {
                    title: 'React',
                    collapsable: true,
                    children: [
                        ['/interview/React/生命周期介绍', 'React生命周期'],
                        ['/interview/React/合成事件', 'React合成事件'],
                        ['/interview/React/自定义hook', '自定义hook'],
                    ],
                },
                {
                    title: 'HTTP',
                    collapsable: true,
                    children: [
                        ['/interview/HTTP/HTTP1.x、HTTP2、HTTP3', 'HTTP1.x、HTTP2、HTTP3'],
                        ['/interview/HTTP/HTTS是如何保证安全的', 'HTTS是如何保证安全的'],
                        ['/interview/HTTP/三次握手，四次挥手', '三次握手，四次挥手'],
                        ['/interview/HTTP/HTTP状态码', 'HTTP状态码'],
                        ['/interview/HTTP/HTTP请求方法', 'HTTP请求方法'],
                        [
                            '/interview/HTTP/一个url到页面展示的完整流程',
                            '一个url到页面展示的完整流程',
                        ],
                        ['/interview/HTTP/TCP和UDP', 'TCP和UDP'],
                    ],
                },
                {
                    title: 'Webpack',
                    collapsable: true,
                    children: [
                        ['/interview/Webpack/webpack的loader和plugin', 'webpack的loader和plugin'],
                        ['/interview/Webpack/webpack热更新原理', 'webpack热更新原理'],
                        ['/interview/Webpack/优化构建速度', '优化构建速度'],
                        ['/interview/Webpack/优化代码体积', '优化代码体积'],
                    ],
                },
                {
                    title: '笔试题',
                    collapsable: true,
                    children: [
                        // ['/interview/笔试题/1', '笔试题1'],
                        // ['/interview/笔试题/2', '笔试题2'],
                        // ['/interview/笔试题/3', '笔试题3'],
                        // ['/interview/笔试题/4', '笔试题4'],
                        // ['/interview/笔试题/5', '笔试题5'],
                        // ['/interview/笔试题/6', '笔试题6'],
                        ['/interview/笔试题/3', '笔试题1'],
                        ['/interview/笔试题/4', '笔试题2'],
                        ['/interview/笔试题/5', '笔试题3'],
                        ['/interview/笔试题/6', '笔试题4'],
                    ],
                },
                // {
                //     title: '面经分享',
                //     collapsable: true,
                //     children: [
                //         ['/interview/面经/2017', '2017年面试总结'],
                //         ['/interview/面经/2020-面试', '2020年面试总结'],
                //     ],
                // },
            ],
            '/100day/': [
                ['/100day/', '100天计划专题'],
                {
                    title: '文章',
                    collapsable: true,
                    children: articles100List,
                },
                {
                    title: '算法题',
                    collapsable: true,
                    children: algorithm100List,
                },
            ],
        },
    },
};
