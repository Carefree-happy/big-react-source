import type { Action } from 'shared/ReactTypes';
import { Dispatch } from 'react/src/currentDispatcher';
import { Lane } from './fiberLanes';

export interface Update<State> {
	action: Action<State>;
	lane: Lane;
	next: Update<any> | null;
}

export interface UpdateQueue<State> {
	dispatch: Dispatch<State> | null;
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(
	action: Action<State>,
	lane: Lane
): Update<State> => {
	return {
		action,
		lane,
		next: null
	};
};

export const createUpdateQueue = <State>() => {
	return {
		dispatch: null,
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	// 支持存放多个 update
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		// pending -> a -> a a和自己形成环状链表
		update.next = update;
	} else {
		// pending -> b -> a -> b
		// pending -> c -> a -> b -> c
		update.next = pending.next;
		pending.next = update;
	}
	updateQueue.shared.pending = update;
	// pending 始终指向最后一个 update
	// pending.next 就能拿到第一个 update
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null,
	renderLane: Lane
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};

	if (pendingUpdate !== null) {
		const first = pendingUpdate.next;
		let pending = pendingUpdate.next as Update<any>;

		do {
			const updateLane = pending.lane;
			if (updateLane === renderLane) {
				const action = pending.action;
				if (action instanceof Function) {
					baseState = action(baseState);
				} else {
					baseState = action;
				}
			} else {
				if (__DEV__) {
					console.error(
						'(processUpdateQueue)',
						'不应该进入updateLane !== renderLane逻辑'
					);
				}
			}
			pending = pending.next as Update<any>;
		} while (pending !== first);
	}
	result.memorizedState = baseState;

	return result;
};
