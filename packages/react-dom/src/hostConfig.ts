import { FiberNode } from 'react-reconciler/src/fiber';
import { HostText } from 'react-reconciler/src/workTags';

export type Instance = Element;
export type Container = Element;
export type TestInstance = Text;

// export const createInstance = (type: string, props: any)
export const createInstance = (type: string): Instance => {
	// TODO 处理 props
	const element = document.createElement(type);
	return element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;

export function commitUpdate(fiber: FiberNode) {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memoizedProps.content;
			return commitTextUpdate(fiber.stateNode, text);
		default:
			if (__DEV__) {
				console.warn('未实现的update', fiber);
			}
			break;
	}
}

export function commitTextUpdate(textInstance: TestInstance, content: string) {
	textInstance.textContent = content;
}

export function removeChild(
	child: Instance | TestInstance,
	container: Container
) {
	container.removeChild(child);
}
