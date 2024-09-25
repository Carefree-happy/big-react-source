import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	type: null;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memorizedProps: Props | null;

	alternate: null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null;
		this.ref = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.pendingProps = pendingProps;
		this.memorizedProps = null;

		this.alternate = null;
		this.flags = NoFlags;
	}
}
