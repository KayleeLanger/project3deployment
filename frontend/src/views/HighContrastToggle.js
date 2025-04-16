import React, { useEffect, useState } from 'react';
import './HighContrast.css';

const HighContrastToggle = () => {
	const [isHighContrast, setIsHighContrast] = useState(() => {
		return localStorage.getItem('highContrast') === 'true';
	});

	useEffect(() => {
		document.body.classList.toggle('high-contrast', isHighContrast);
		localStorage.setItem('highContrast', isHighContrast);
	}, [isHighContrast]);

	return (
		<button className="contrast-toggle" onClick={() => setIsHighContrast(prev => !prev)}>
			High Constrast Mode
		</button>
	);
};

export default HighContrastToggle;
