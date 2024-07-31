react内部3个阶段：
* schedule阶段
* render阶段（beginWork completeWork）
* commit阶段（commitWork）

commit阶段的3个子阶段
* beforeMutation阶段
* mutation阶段
* layout阶段

commit 阶段要执行的任务
* fiber树的切换
* 执行Placement对应操作

# 测试代码功能
## react,react-dom 全局链接
```
cd dist/node_modules/react 

pnpm link --global 

 WARN  link:/Users/sun/developer/react/big-react-source/dist/node_modules/react has no binaries

/Users/sun/Library/pnpm/global/5:
+ react 1.0.0 <- ../../../../developer/react/big-react-source/dist/node_modules/react

cd ../react-dom 

pnpm link --global

 WARN  link:/Users/sun/developer/react/big-react-source/dist/node_modules/react-dom has no binaries

/Users/sun/Library/pnpm/global/5:
+ react-dom 1.0.0 <- ../../../../developer/react/big-react-source/dist/node_modules/react-dom
```

```
pnpm unlink --global react
pnpm unlink --global react-dom
```

## 新建react项目
```
npx create-react-app apps

pnpm link react --global
pnpm link react-dom --global

全局链接替换为本地链接
pnpm unlink react --global && pnpm link react
pnpm unlink react-dom --global && pnpm link react-dom

echo "node_modules/
dist/" >> .eslintignore
```

