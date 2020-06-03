module.exports = {
    base: '/blog/',
    title: '前端学习总结', 
    description: '前端学习总结',
    head: [
        ['link', { rel: 'icon', href: 'https://cdn.wangyaxing.cn/icon-128x128.png' }],
    ],
    themeConfig: {
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        nav: [
            { 
                text: '首页', 
                link: '/'
            },
            { 
                text: '算法',
                link: '/algorithm/'
            },
            {  text: '手写代码', 
               link: '/jsCode/'
            },
            {  text: '面试题', 
               link: '/interview/'
            },
            { 
                text: '100天',
                link: '/100day/'
            },
            { text: 'Github', link: 'https://github.com/funnycoderstar/blog' },
        ],
        sidebar: {
            '/algorithm/': [
                ['/algorithm/', '算法专题'],
                {
                    title: '树',
                    collapsable: true,
                    children: [
                        ['/algorithm/树/树的遍历', '树的遍历(DFS和BFS)'],
                        ['/algorithm/树/路径总和', '路径总和(I、II、III)'],
                        ['/algorithm/树/相同的树', '相同的树'],
                        ['/algorithm/树/对称二叉树', '对称二叉树'],
                        ['/algorithm/树/翻转二叉树', '翻转二叉树'],
                        ['/algorithm/树/另一个树的子树', '另一个树的子树'],
                        ['/algorithm/树/验证二叉搜索树', '验证二叉搜索树'],
                        ['/algorithm/树/二叉树的最大深度', '二叉树的最大深度'],
                        ['/algorithm/树/二叉树的最小深度', '二叉树的最小深度'],
                        ['/algorithm/树/平衡二叉树', '平衡二叉树'],
                        ['/algorithm/树/将有序数组转换为二叉搜索树', '将有序数组转换为二叉搜索树'],
                        ['/algorithm/树/二叉搜索树迭代器', '二叉搜索树迭代器'],
                    ]
                },
                {
                    title: '链表',
                    collapsable: true,
                    children: [
                        ['/algorithm/链表/合并两个有序链表', '合并两个有序链表'],
                        ['/algorithm/链表/反转链表', '反转链表'],
                        ['/algorithm/链表/回文链表', '回文链表'],
                        ['/algorithm/链表/倒数第K个节点', '倒数第K个节点'],
                        ['/algorithm/链表/找出链表的中间节点', '找出链表的中间节点'],
                        ['/algorithm/链表/两个链表的第一个公共节点', '两个链表的第一个公共节点'],
                        ['/algorithm/链表/LRU', 'LRU缓存机制'],
                    ]   
                },
                {
                    title: '数组',
                    collapsable: true,
                    children: [
                        ['/algorithm/数组/打乱数组', '打乱数组'],
                        ['/algorithm/数组/构建乘积数组', '构建乘积数组'],
                        ['/algorithm/数组/使数组唯一的最小增量', '使数组唯一的最小增量'],
                        ['/algorithm/数组/扑克牌中的顺子', '扑克牌中的顺子'],
                        ['/algorithm/数组/数组的交集', '数组的交集'],
                        ['/algorithm/数组/数组的交集II', '数组的交集II'],
                        ['/algorithm/数组/数组中的第K个最大元素', '数组中的第K个最大元素'],
                        ['/algorithm/数组/合并两个有序数组', '合并两个有序数组'],
                        ['/algorithm/数组/全排列', '全排列'],
                        ['/algorithm/数组/螺旋矩阵', '螺旋矩阵'],
                        ['/algorithm/数组/螺旋矩阵II', '螺旋矩阵II'],
                    ]
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
                    ]   
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
                        ['/algorithm/动态规划/打家劫舍', '打家劫舍'],
                        ['/algorithm/动态规划/打家劫舍II', '打家劫舍 II'],
                        ['/algorithm/动态规划/打家劫舍III', '打家劫舍 III'],
                    ]   
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
                ['/jsCode/手写继承', '手写继承'],
                ['/jsCode/实现一个async函数', '实现一个async函数'],
                ['/jsCode/实现一个iterator', '实现一个iterator'],
                ['/jsCode/setTimeout实现setInterval', 'setTimeout实现setInterval'],
                ['/jsCode/限制并发请求', '限制并发请求'],
                ['/jsCode/简单实现一个Vue的双向绑定', '简单实现一个Vue的双向绑定'],
                ['/jsCode/实现一个vue自定义指令-懒加载', '实现一个vue自定义指令-懒加载'],
                ['/jsCode/实现一个轮播图', '实现一个轮播图'],
                ['/jsCode/放大镜效果', '放大镜效果'],
                // '/jsCode/手动实现JSONP',
                // '/jsCode/基于Promise的ajax封装',
                // '/jsCode/单例模式',
                // '/jsCode/异步循环打印',
            ],
            '/interview/': [
                ['/interview/', '面试题专题'],
                {
                    title: 'CSS',
                    collapsable: true,
                    children: [
                        ['/interview/CSS/CSS基础知识点', 'CSS基础知识点'],
                        ['/interview/CSS/伪类和伪元素', '伪类和伪元素'],
                        ['/interview/CSS/实现固定宽高比的div', '实现固定宽高比的div'],
                        ['/interview/CSS/css解析规则', 'css解析规则'],
                        ['/interview/CSS/CSS选择器', 'CSS选择器'],
                        ['/interview/CSS/display:none和visibility:hidden的区别', 'display: none和 visibility:hidden的区别'],
                        ['/interview/CSS/flex.md', 'flex:1'],
                        ['/interview/CSS/常见CSS布局的实现', '常见CSS布局的实现'],
                    ]
                },
                {
                    title: 'React',
                    collapsable: true,
                    children: [
                        ['/interview/React/生命周期介绍', 'React生命周期'],
                        ['/interview/React/合成事件', 'React合成事件'],
                        ['/interview/React/自定义hook', '自定义hook'],
                    ]
                },
                {
                    title: 'HTTP',
                    collapsable: true,
                    children: [
                        ['/interview/HTTP/HTTP1.x、HTTP2、HTTP3', 'HTTP1.x、HTTP2、HTTP3'],
                        ['/interview/HTTP/HTTPS', 'HTTPS'],
                        ['/interview/HTTP/三次握手，四次挥手', '三次握手，四次挥手'],
                        ['/interview/HTTP/HTTP状态码', 'HTTP状态码'],
                        ['/interview/HTTP/HTTP请求方法', 'HTTP请求方法'],
                        ['/interview/HTTP/一个url到页面展示的完整流程', '一个url到页面展示的完整流程'],
                        ['/interview/HTTP/TCP和UDP', 'TCP和UDP'],
                    ]   
                },
                {
                    title: 'Webpack',
                    collapsable: true,
                    children: [
                        ['/interview/Webpack/webpack的loader和plugin', 'webpack的loader和plugin'],
                        ['/interview/Webpack/webpack热更新原理', 'webpack热更新原理'],
                        ['/interview/Webpack/优化构建速度', '优化构建速度'],
                        ['/interview/Webpack/优化代码体积', '优化代码体积'],
                    ]   
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

                    ]
                },
                {
                    title: '面经分享',
                    collapsable: true,
                    children: [
                        ['/interview/面经/2017', '2017年面试总结'],
                    ]
                },
            ],
            '/100day/': [
                ['/100day/', '100天计划专题'],
                {
                    title: '001',
                    collapsable: true,
                    children: [
                        ['/100day/001/import和require', 'import和require'],
                        ['/100day/001/买卖股票的最佳时机', '买卖股票的最佳时机'],
                    ]
                },
                {
                    title: '002',
                    collapsable: true,
                    children: [
                        ['/100day/002/setTimeout和requestAnimationFrame', 'setTimeout和requestAnimationFrame'],
                        ['/100day/002/合并两个有序链表', '合并两个有序链表'],
                    ]   
                },
                {
                    title: '003',
                    collapsable: true,
                    children: [
                        ['/100day/003/typeof和instanceof原理', 'typeof和 instanceof 原理'],
                        ['/100day/003/最大子序和', '最大子序和'],
                    ]   
                },
                {
                    title: '004',
                    collapsable: true,
                    children: [
                        ['/100day/004/for...of原理解析', 'for of 的原理解析'],
                        ['/100day/004/扑克牌中的顺子', '扑克牌中的顺子'],
                    ]   
                },
                {
                    title: '005',
                    collapsable: true,
                    children: [
                        ['/100day/005/Generator函数', 'Generator函数'],
                        ['/100day/005/无重复字符的最长子串', '无重复字符的最长子串'],
                    ]   
                },
                {
                    title: '006',
                    collapsable: true,
                    children: [
                        ['/100day/006/async原理解析', 'async原理解析'],
                        ['/100day/006/搜索二维矩阵II', '搜索二维矩阵II'],
                    ]   
                },
                {
                    title: '007',
                    collapsable: true,
                    children: [
                        ['/100day/007/详解ES6中的class', '详解ES6中的class'],
                        ['/100day/007/将有序数组转换成二叉树', '将有序数组转换成二叉树'],
                    ]   
                },
                {
                    title: '008',
                    collapsable: true,
                    children: [
                        ['/100day/008/装饰器', '装饰器'],
                        ['/100day/008/路径总和', '路径总和'],
                    ]   
                },
                {
                    title: '009',
                    collapsable: true,
                    children: [
                        ['/100day/009/简单通俗理解vue3.0中的Proxy', '简单通俗理解 vue3.0中的Proxy'],
                        ['/100day/009/两句话中的不常见单词', '两句话中的不常见单词'],
                    ]   
                },
                {
                    title: '010',
                    collapsable: true,
                    children: [
                        ['/100day/010/从JS底层理解var,const,let', '从JS底层理解var,const,let'],
                        ['/100day/010/有效的山脉数组', '有效的山脉数组'],
                    ]   
                },
                {
                    title: '011',
                    collapsable: true,
                    children: [
                        ['/100day/011/三行代码实现add(1)(2)(3)', '三行代码实现 add(1)(2)(3)'],
                        ['/100day/011/数组的交集', '数组的交集'],
                    ]   
                },
                {
                    title: '012',
                    collapsable: true,
                    children: [
                        ['/100day/012/一文理解this&call&apply&bind', '一文理解 this、call、apply、bind'],
                        ['/100day/012/数组的交集II', '数组的交集II'],
                    ]   
                },
                {
                    title: '013',
                    collapsable: true,
                    children: [
                        ['/100day/013/常考算法面试题系列-树的遍历', '常考算法面试题系列：树的遍历'],
                    ]   
                },
                {
                    title: '014',
                    collapsable: true,
                    children: [
                        ['/100day/014/赋值、浅拷贝、深拷贝区别', '赋值、浅拷贝、深拷贝区别'],
                        ['/100day/014/构建乘积数组', '构建乘积数组'],
                    ]
                },
                {
                    title: '015',
                    collapsable: true,
                    children: [
                        ['/100day/015/如何启动一个本地静态服务器', '如何启动一个本地静态服务器'],
                        ['/100day/015/使数组唯一的最小增量', '使数组唯一的最小增量'],
                    ]
                },
                {
                    title: '016',
                    collapsable: true,
                    children: [
                        ['/100day/016/命令行参数', '命令行参数'],
                        ['/100day/016/反转链表', '反转链表'],
                    ]
                },
                {
                    title: '017',
                    collapsable: true,
                    children: [
                        ['/100day/017/4个问题带你进阶ReactHooks', '4个问题带你进阶React Hooks'],
                    ]
                },
                {
                    title: '018',
                    collapsable: true,
                    children: [
                        ['/100day/018/常考算法面试题系列-链表的操作', '常考算法面试题系列：链表的操作'],
                    ]
                },
                {
                    title: '019',
                    collapsable: true,
                    children: [
                        ['/100day/019/keep-alive的实现原理及LRU缓存策略', 'keep-alive的实现原理及LRU缓存策略'],
                    ]
                },
                {
                    title: '020',
                    collapsable: true,
                    children: [
                        ['/100day/020/nextTick的原理及运行机制', 'nextTick的原理及运行机制'],
                    ]
                },
            ],
        }
    }
}