import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

// 主要实现一个完整的工作循环
// 全局的指针指向正在工作的 fiberNode
let workInProgress: FiberNode | null = null;

// 最终执行的方法
function renderRoot(root: FiberNode) {
	// 初始化
	prepareRefreshStack(root);
	// 执行递归的流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.log('workLoop 发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

// workingProgress 指向当前遍历的第一个FiberNode
function prepareRefreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

// workInProgress 不为空就持续执行
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// next是子Fiber或者为null
	// 如果有子节点，就一直执行，遍历子节点
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 如果没有子节点，就遍历兄弟节点
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 这里本来应该不应该套一层，没想清楚什么时候父节点为空
		if (node.return !== null) {
			node = node.return;
		}
		workInProgress = node;
	} while (node !== null);
}

export default renderRoot;
