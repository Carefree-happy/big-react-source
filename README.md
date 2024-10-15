1. 新建 big-react
2. git checkout -b resource
3. pnpm init
4. 初始化 pnpm-workspace.yaml
5. 开发规范（代码规范的检查、代码风格的检查、代码提交信息的检查）

```
-w 指在项目根目录下安装依赖
pnpm i eslint -D -w

eslint 能够检查代码规范以及风格, 但是要将代码风格检查交给 prettier
npx eslint --init
❯ To check syntax and find problems
❯ JavaScript modules (import/export)
❯ None of these
❯ TS ? Yes
✔ Node
❯ JSON

pnpm i -D -w @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
```

```
WARN  Issues with peer dependencies found
.
├─┬ @typescript-eslint/eslint-plugin
│ ├── ✕ missing peer typescript@"*"
│ └─┬ @typescript-eslint/type-utils
│   ├── ✕ missing peer typescript@"*"
│   └─┬ @typescript-eslint/typescript-estree
│     ├── ✕ missing peer typescript@"*"
│     └─┬ ts-api-utils
│       └── ✕ missing peer typescript@>=4.2.0
└─┬ @typescript-eslint/parser
  └── ✕ missing peer typescript@"*"

很多库依赖了其他库，但是其他库又没必要安装
pnpm i -D -w typescript
```

.eslintrc.json
parser 指解析JS代码为抽象语法树的解析器
parserOptions parser的配置
rules 具体的lint规则
plugins 一些规则的合集
extends 继承其他eslint的配置

安装 TS 相关 eslint 的插件
pnpm i -D -w @typescript-eslint/eslint-plugin

pnpm i prettier -D -w

将prettier集成到eslint中
pnpm i eslint-config-prettier eslint-plugin-prettier -D -w

commit拦截
pnpm i husky -D -w
husky初始化
npx husky install
将pnpm lint纳入commit时husky即将执行的脚本
npx husky add .husky/pre-commit "pnpm lint"

commit信息检查
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D -w
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"

```
feat: 添加新功能
fix: 修复 Bug
chore: 一些不影响功能的更改
docs: 专指文档的修改
perf: 性能方面的优化
refactor: 代码重构
test: 添加一些测试代码等等
```

实现第一版：界面能够渲染

测试代码的时候
先跑一遍实例，pnpm build:dev
然后再跑一遍，pnpm run test
