import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './flags';

function ChildReconciler(shouldTrackEffects: boolean) {
	// 为什么设计成闭包，这样就能根据是否传newChild，返回不同的实现
	function reconcileSingleElement(
		returnFiber: FiberNode,
		_currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据element创建fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		_currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFibers: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 多节点的情况 ul > li * 3
		// return fiberNode
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFibers, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.log('未实现的reconcile类型', newChild);
					}
					break;
			}
		}

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFibers, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('未实现的reconsile类型', newChild);
		}
		return null;
	};
}

// 追踪副作用
export const reconcileChildFibers = ChildReconciler(true);
// 不追踪副作用
export const mountChildFibers = ChildReconciler(false);
