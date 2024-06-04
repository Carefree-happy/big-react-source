mount 流程，首屏渲染的更新流程

更新流程的目的：
* 生成 wip fiberNode 树
* 标记副作用 flags

更新流程的步骤：
* 递：beginWork
* 归：completeWork

beginWork 标记与结构变化相关的 flags

Placement:
插入： a -> ab  移动：abc -> bca
ChildDeletion
删除: ul>li*3 -> ul>li*1

不包含与「属性变化」相关的flag：Update
<img title="111" /> -> <img title="222" />

```
<!-- 添加 __DEV__ 标识 -->
pnpm i -d -w @rollup/plugin-replace
```