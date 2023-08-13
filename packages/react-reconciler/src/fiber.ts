import { Key, Props, ReactElementType, Ref } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './flags';
import { Container } from 'hostConfig';

export class FiberNode {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type: any;
	tag: WorkTag;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pendingProps: any;
	key: Key;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	subtreeFlags: Flags;
	updateQueue: unknown;

	// pendingProps 当前的 FiberNode, tag 指 fiberNode 类型
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// 对于 HostComponent 对应<div>的话，stateNode保存了 div 这个 DOM
		this.stateNode = null;
		// FunctionComponent () => {}，tag 为 0，type 对应function本身
		this.type = null;

		// 构成树状结构
		// 指向父，将FiberNode当作一个工作单元，执行结束后return到父fiberNode
		this.return = null;
		// 指向兄弟fiberNode
		this.sibling = null;
		// 指向子fiberNode
		this.child = null;
		// 指向
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		// 刚开始准备工作的时候 props;
		this.pendingProps = pendingProps;
		// 工作完了之后 props
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		// 用于在 fiberNode 和对应的另外一个 fiberNode 之间切换
		this.alternate = null;
		// 统称为副作用，存储标记
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	// 保存数组环境挂载的节点, rootElement
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

// 这个方法传进来一个fiberNode，应该返回对应的另外一个fiberNode，方便切换
export const createWorkInProcess = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// 首屏渲染 mount
		wip = new FiberNode(current.tag, pendingProps, current);
		wip.type = current.type;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// <div/> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
