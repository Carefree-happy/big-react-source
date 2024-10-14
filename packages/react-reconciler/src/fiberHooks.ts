import type { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import type { Action } from 'shared/ReactTypes';
import type { FiberNode } from './fiber';
import type { UpdateQueue } from './updateQueue';
import internals from 'shared/internals';
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	memorizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

export function renderWithHooks(wip: FiberNode) {
	currentlyRenderingFiber = wip;
	// 重置，存储当前 fiber 的 hooks
	wip.memorizedState = null;

	const current = wip.alternate;
	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	currentlyRenderingFiber = null;
	return children;
}

function mountState<State>(
	initialState: State | (() => State)
): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook();

	let memorizedState;
	if (initialState instanceof Function) memorizedState = initialState();
	else memorizedState = initialState;

	hook.memorizedState = memorizedState;

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;

	// @ts-expect-error TODO: fix this
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;

	return [memorizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memorizedState: null,
		updateQueue: null,
		next: null
	};

	if (workInProgressHook === null) {
		// mount 时第一个 hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件中调用 hooks');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount 时以后的 hook
		workInProgressHook = workInProgressHook.next = hook;
	}
	return workInProgressHook;
}
