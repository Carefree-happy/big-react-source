export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof Hostcomponent
	| typeof HostTest;

export const FunctionComponent = 0;
export const HostRoot = 3; // ReactDOM.render() 对应的节点
export const Hostcomponent = 5; // <div/>
export const HostTest = 6; // div 下的文本
