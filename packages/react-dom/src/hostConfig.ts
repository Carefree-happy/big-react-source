export type Instance = Element;
export type Container = Element;

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
