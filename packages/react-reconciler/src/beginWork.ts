import { FiberNode } from './fiber';

// 递归中的递阶段
export const beginWork = (fiber: FiberNode) => {
	// 比较、递归子fiberNode
	console.log(fiber);
	return fiber;
};
