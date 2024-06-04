reconciler 又叫做 协调器，协调（reconcile）就是diff算法的意思。

调用宿主环境API显示真实的UI

运行时核心模块：React reconciler; Vue render

描述UI的方法： JSX或者模版语法，React 没有编译优化


# 核心模块消费JSX的过程

JSX 执行的结果是 ReactElement;

JSX 不能作为 Reconciler 操作的数据结构;

ReactElement如果作为核心模块操作的数据结构，存在的问题：

* 无法表达节点之间的关系

* 字段有限，不好拓展（比如：无法表达状态）

# 需要一种新的数据结构，他的特点：

* 介于ReactElement与真实UI节点之间

* 能够表达节点之间的关系

* 方便拓展（不仅作为数据存储单元，也能作为工作单元）

这就是FiberNode（虚拟DOM在React中的实现, VUE v-node）

对于同一个节点，比较其 ReactElement 与 fiberNode，生成子 fiberNode。并根据比较的结果

生成不同标记（插入、删除、移动......），不同的标记对应不同宿主环境API的执行

```
cd packages && mkdir 
```

目前了解的节点类型
* JSX
* ReactElement
* FiberNode
* DOM Element

```
cd packages
mkdir react-reconciler && cd react-reconciler
mkdir src && cd src && touch index.ts && touch fiber.ts

创建根节点
cd react-reconciler
引入 shared
pnpm i 
```

创建 FiberNode 节点, workTags

pnpm i 添加依赖

```bash
| - react-reconciler
    | - node_modules pnpm安装模块
    | - src 配置文件目录，主要包含Webpack配置
        | - fiber 存放 FiberNode 的数据结构
        | - dev
        | - prod
        | - config.js
    | - dist 分发目录
    | - docs 文档
```

reconciler 的工作方式

对于同一个节点，比较其 ReactElement 与 fiberNode，生成子 fiberNode。
并根据比较的结果生成不同标记（插入、删除、移动......），对应不同宿主环境API的执行。

记录节点的 tag, key, stateNode, type

记录关联节点 比如：return, sibling, child, index

记录自身关联 ref

记录自身副作用 flags

# 实现 fiberNode 的数据结构
```
    // 实例类型
	type: any;
    // 实例类型值，对应不同的 workTags
	tag: any;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
    // FiberNode 转换
	alternate: FiberNode | null;
    // 标记副作用
	flags: Flags;
```

React Element, 意味着：
- 如果有子节点，遍历子节点
- 如果没有子节点，遍历兄弟节点

这是一个递归的过程，存在递（beginWork）和归（compileWork）两个阶段


[双缓存技术](https://blog.csdn.net/wwwlyj123321/article/details/126447825)

[DFS 深度优先遍历与 BFS 广度优先遍历详解](https://houbb.github.io/2020/01/23/data-struct-learn-08-dfs-bfs)

以DFS（深度优先遍历）的顺序遍历ReactElement，这意味着：
* 如果有子节点，遍历子节点
* 如果没有子节点，遍历兄弟节点

这是个递归的过程，存在递、归两个阶段：
* 递：对应beginWork
* 归：对应completeWork

如果一个组件卸载了，那么它的子孙组件的componentWillMount执行顺序是什么？
子组件先 WillMount，其次才是父组件 WillMount