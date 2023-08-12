import { Action } from 'shared/ReactTypes';
import { Update } from './flags';

// 代表 update 的数据结构
// this.setState({} | ({}) => ({})) 可以传一个值或者一个返回值的函数
export interface Update<State> {
	action: Action<State>;
}

// 消费 update 的数据结构
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// add a method to create update
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

// add a method to create updateQueue
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

// add update to updateQueue
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

// go for updating
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		// baseState 1 update 2 -> memoizedState 2
		// baseState 1 update (x) => 2x -> memoizedState 2
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
