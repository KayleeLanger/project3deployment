import React, { useEffect, useState } from 'react';
import './LargeTextButtons.css';
import * as functions from "./functions.js";

const LargeTextButtons = () => {
	const [isLargeTextButtons, setLargeTextButtons] = useState(() => {
		return localStorage.getItem('largeTextButtons') === 'true';
	});

	useEffect(() => {
		document.body.classList.toggle('large-text', isLargeTextButtons);
		localStorage.setItem('largeTextButtons', isLargeTextButtons);
	}, [isLargeTextButtons]);
	return (
		<functions.AccessButton onClick={() => setLargeTextButtons(prev => !prev)}/>
	);
};

export default LargeTextButtons;
