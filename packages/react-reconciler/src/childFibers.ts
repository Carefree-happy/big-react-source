import { Props, ReactElementType } from 'shared/ReactTypes';
import {
	FiberNode,
	createFiberFromElement,
	createWorkInProgress
} from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './flags';

function ChildReconciler(shouldTrackEffects: boolean) {
	function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
		if (!shouldTrackEffects) {
			return;
		}
		const deletions = returnFiber.deletions;
		if (deletions === null) {
			returnFiber.deletions = [childToDelete];
			returnFiber.flags |= ChildDeletion;
		} else {
			deletions.push(childToDelete);
		}
	}

	// 为什么设计成闭包，这样就能根据是否传newChild，返回不同的实现
	/**
	 * 根据reactElement对象创建fiber并返回
	 * @param {FiberNode} returnFiber
	 * @param {FiberNode | null} currentFiber
	 * @param {ReactElementType} element
	 */
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const key = element.key;
		// update的情况<单节点的处理 div -> p>
		if (currentFiber !== null) {
			// key相同
			if (currentFiber.key !== key) {
				// 是react元素
				if (element.$$typeof === REACT_ELEMENT_TYPE) {
					// type 相同
					if (currentFiber.type === element.type) {
						const existing = useFiber(currentFiber, element.props);
						existing.return = returnFiber;
						return existing;
					}
					// 删除旧的 （key相同，type不同）
					deleteChild(returnFiber, currentFiber);
				} else {
					if (__DEV__) {
						console.warn('还未实现的React类型', element);
					}
				}
			} else {
				// 删掉旧的，之后创建新的
				deleteChild(returnFiber, currentFiber);
			}
		}

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

		// 兜底操作
		if (currentFiber !== null) {
			deleteChild(returnFibers, currentFiber);
		}

		if (__DEV__) {
			console.warn('未实现的reconsile类型', newChild);
		}
		return null;
	};
}

/**
 * 双缓存树原理：基于当前的fiberNode创建一个新的fiberNode, 而不用去调用new FiberNode
 * @param {FiberNode} fiber
 * @param {Props} pendingProps
 * @returns {FiberNode}
 */
function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
	const clone = createWorkInProgress(fiber, pendingProps);
	clone.index = 0;
	clone.sibling = null;
	return clone;
}

// 追踪副作用
export const reconcileChildFibers = ChildReconciler(true);
// 不追踪副作用
export const mountChildFibers = ChildReconciler(false);
