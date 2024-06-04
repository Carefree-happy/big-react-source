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

