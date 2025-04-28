import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import './HomeScreen.css';
import Button from '../Button';
import HighContrastToggle from './HighContrastToggle';
import './HighContrast.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import LargeTextButtons from "./LargeTextButton.js";

function HomeScreen({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [user, setUser] = useState(null); // Stores logged-in user info

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="home-container">
			<HighContrastToggle /> {/* <-- just drop this in every page */}
			<LargeTextButtons/>
			
			<div className="top-bar">
				<span className="date-time">
					{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
				</span>
			</div>

			<div className="logo-section">
				<img src={logo} className="App-logo" alt="logo" />
			</div>
			<h1>Welcome to Our POS System</h1>
			<h3>Employees Sign In Here:</h3>
			{!user && (
				
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						const decoded = jwtDecode(credentialResponse.credential);
						console.log("Logged in user:", decoded);
						setUser(decoded); // Store user info to unlock the page
					}}
					onError={() => {
						console.log("Login Failed");
					}}
				/>
			)}

			{/* only show manager/cashier option buttons after user authentication */}
			{user && (
				<>
				<p>Hello, {user.name}!</p>

				<div className="button-section">
					<Button text="Go to Cashier" onClick={() => setScreen("cashier")}/>
					<Button text="Go to Manager" onClick={() => setScreen("manager")} />
				</div>
				</>
			)}
			
			{/* Customer and menu board are accessible without authentication */}
			<div className="button-section">
				<Button text="Go to Customer" onClick={() => setScreen("customer")} />
				<Button text="Go to Menu Board" onClick={() => setScreen("menu-board")} />
			</div>
		</div>
	);
}

export default HomeScreen;
