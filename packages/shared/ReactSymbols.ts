const supportSymbol = typeof Symbol === 'function' && Symbol.for;
// 当前环境是否支持Symbol
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('React.element')
	: 0xeac7;
