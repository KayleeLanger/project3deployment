import React from 'react'; //dis the button

function Button({ text, onClick }) {
	return (
		<button onClick={onClick}>
			{text}
		</button>
	);
}

export default Button;
