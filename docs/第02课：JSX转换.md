React项目结构：

1.react（宿主环境无关的公用方法, React.createElement React.cloneElement）

2.react-reconciler（协调器的实现，宿主环境无关）

3.各种宿主环境的包（React.DOM, 测试React的宿主环境）

4.shared（公用辅助方法，宿主环境无关）

目标：实现项目结构中的部分功能：将实现的JSX转换属于react包

# jsx 方法

```
cd packages && mkdir react && cd react && pnpm init
```
main 对应 commonjs 规范下包的入口文件

rollup 打包原生支持 esmodule, 对应入口 module

package.json 文件中的scripts属性是用来运行npm run命令，不需要

# 创建 JSX 文件

```shell
mkdir src && cd src && echo '// ReactElement' > jsx.tsx
```

# 创建 ReactElement，ReactTypes

```shell
mkdir shared && cd shared && pnpm init

# 将 react element 定义为一个独一无二的值
echo '// ReactSymbols' > ReactSymbols.ts

# 定义 react element 的类型
echo '// ReactTypes' > ReactTypes.ts
```

# 实现 JSX 方法: 遍历属性以及子组件长度

- jsxDEV方法（dev环境）

- jsx方法（prod环境）

- React.createElement方法

# 打包流程

```shell
cd packages && mkdir scripts && cd scripts && mkdir rollup && cd rollup

# 安装 node 包

pnpm i -D -w rimraf rollup-plugin-generate-package-json rollup-plugin-typescript2 @rollup/plugin-commonjs @rollup/plugin-replace

# pack config
echo '// config' > react.config.js

# utils
echo '// utils' > utils.js
```

# 对应上述 3 种实现方法，打包对应文件，并配置package.json:

- react/jsx-dev-runtime.js（dev环境）

- react/jsx-rumtime.js（prod环境）

- React

- package.json

# test 打包后的产物

1.项目目录下的打包react，pnpm link --global，全局node_modules下的react指向当前打包后的react
2.npx创建新的 demo 项目，pnpm link react --global
3.更改 react 中的内容，重新打包，并重启项目

将打包生成的 react 包指向全局环境下的 react 包

```shell
pnpm build:dev

cd dist/node_modules/react

pnpm link --global

cd ../../../

npx create-react-app react-demo

cd react-demo

const jsx = <div>hello world<span>big-react</span></div>
console.log(React);
console.log(jsx);

pnpm link react --global

# 更改packages react 中的内容

项目目录下重新打包
cd ../ && pnpm build:dev

重启项目
cd react-demo && pnpm start

并期待后面的热更新的效果
```
