import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import './HomeScreen.css';
import Button from '../Button';

function HomeScreen({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="home-container">
			<div className="top-bar">
				<span className="date-time">
					{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
				</span>
			</div>

			<div className="logo-section">
				<img src={logo} className="App-logo" alt="logo" />
			</div>

			<div className="button-section">
				<Button text="Go to Cashier" onClick={() => setScreen("cashier")} />
				<Button text="Go to Manager" onClick={() => setScreen("manager")} />
				<Button text="Go to Customer" onClick={() => setScreen("customer")} />
				<Button text="Go to Menu Board" onClick={() => setScreen("menu-board")} />
			</div>
		</div>
	);
}

export default HomeScreen;
