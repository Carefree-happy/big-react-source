1. React项目结构：
react（宿主环境无关的公用方法）
react-reconciler（协调器的实现，宿主环境无关）
各种宿主环境的包
shared（公用辅助方法，宿主环境无关）

2. JSX转化属于react包
- 实现jsx方法
- 实现打包流程
- 实现调试打包结果的环境

建立 React 文件夹，pkg 建立 module 入口；
JSX转换包括两部分：
编译时：babeljs自动转换
运行时：jsx 或者 React.createElement方法，手动

打包对应文件：
react/jsx-dev-runtime.js（dev环境）
react/jsx-rumtime.js（prod环境）
React

pnpm i -D -w rollup-plugin-typescript
pnpm i -D -w @rollup/plugin-commonjs
pnpm i -D -w rimraf 兼容windows,删除文件
pnpm i -D -w rollup-plugin-generate-package-json