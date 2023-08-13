export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;
export const HostRoot = 3; // ReactDOM.render() 对应的节点
export const HostComponent = 5; // <div/>
export const HostText = 6; // div 下的文本
