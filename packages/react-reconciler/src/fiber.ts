import { Key, Props, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './flags';

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
	alternate: FiberNode | null;
	flags: Flags;

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
		// 用于在 fiberNode 和对应的另外一个 fiberNode 之间切换
		this.alternate = null;
		// 统称为副作用，存储标记
		this.flags = NoFlags;
	}
}
