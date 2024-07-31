import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
function App() {
	const [num, setNum] = useState(0);
	return (
		<div
			onClick={() => {
				setNum(2);
				console.log(2);
			}}
		>
			{num}
		</div>
	);
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);
