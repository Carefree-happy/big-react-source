import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProcess } from './fiber';
import { MutationMask, NoFlags } from './flags';
import { HostRoot } from './workTags';

// 主要实现一个完整的工作循环
// 全局的指针指向正在工作的 fiberNode
let workInProgress: FiberNode | null = null;

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 在fiber中调度功能,
	const root = markUpdateFormFiberToRoot(fiber);
	renderRoot(root);
}

// 递归遍历到根节点
function markUpdateFormFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

// 最终执行的方法
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareRefreshStack(root);
	// 执行递归的流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.log('workLoop 发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip fiberNode树 树中的 flags
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;

	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('commit 阶段开始', finishedWork);
	}

	// 重置操作
	root.finishedWork = null;

	// 判断是否存在3个字阶段需要执行的操作
	// root flags root subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		// beforeMution
		// mutation Placement

		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
}

// workingProgress 指向当前遍历的第一个FiberNode
function prepareRefreshStack(root: FiberRootNode) {
	// 之前是直接将 fiber 赋值给 workInProgress
	// 知道了真实的工作流程后，知道传入的是 FiberRootNode
	const workInProgress = createWorkInProcess(root.current, {});
	return workInProgress;
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
	return null;
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
