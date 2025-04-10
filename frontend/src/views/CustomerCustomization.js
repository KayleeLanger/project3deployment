import { useEffect, useState } from "react";
import "./Customer.css";

function CustomerCustomization({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Sidebar */}
			<div className="sidebar">
				<div className="time-box">
					<h2>{currentTime.toLocaleTimeString()}</h2>
					<strong>{currentTime.toLocaleDateString()}</strong>
				</div>
				<button onClick={() => setScreen("customer-drinks")}>Back</button>
			</div>

			{/* Main content */}
			<div className="main" style={{ flex: 1, textAlign: "center" }}>
				<h1>Customization Coming Soon</h1>
				<p>This screen will let customers pick size, ice, and sweetness.</p>

				<button
					onClick={() => setScreen("confirm")}
					style={{
						marginTop: "40px",
						backgroundColor: "#4CAF50",
						color: "white",
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: "18px",
						cursor: "pointer",
					}}
				>
					Go to Confirmation
				</button>
			</div>
		</div>
	);
}

export default CustomerCustomization;
