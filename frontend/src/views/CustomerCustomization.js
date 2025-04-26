import { useEffect, useState } from "react";
import "./Customer.css";
import * as functions from "./functions.js";
import LargeTextButtons from "./LargeTextButton.js";

function CustomerCustomization({ setScreen, selectedCategory, OrderDetails, setorderDetails, currentEditIdx, setCurrentEditIdx, setToppingMode }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	const [size, setSize] = useState("");
	const [ice, setIce] = useState("");
	const [sweetness, setSweetness] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// to make sure that correct item is edited (whether or not edit is clicked)
	useEffect(() => {
		const idx = currentEditIdx != null ? currentEditIdx : OrderDetails.length - 1;
		if (OrderDetails[idx]) {
			const item = OrderDetails[idx];
			setSize(item.size || "");
			setIce(item.ice || "");
			setSweetness(item.sweetness || "");
		}
	}, [currentEditIdx, OrderDetails]);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Sidebar */}
			<div className="sidebar">
				<div className="time-box">
					<h2>{currentTime.toLocaleTimeString()}</h2>
					<strong>{currentTime.toLocaleDateString()}</strong>
				</div>
				<button onClick={() => {
									setScreen("customer-drinks");
									functions.deleteItem(OrderDetails.length-1, OrderDetails, setorderDetails, setScreen, "customer");
								}}>
								Back
				</button>
			</div>

			{/* Main content */}
			<div className="main" style={{ flex: 1, textAlign: "center", flexDirection:"column" }}>
			
				<table>
					<tr><LargeTextButtons/></tr>
					<tr>
				<h1 style={{color:"black"}}>Customize Your Drink!</h1>
				<p>Pick size, ice, sweetness, and toppings.</p>
			
				<h1>Customization<br></br></h1>
				</tr>
				<tr>
				<div className = "customization-options">
					<functions.SizeSelector selectedSize={size} setSelectedSize={setSize} details={OrderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx} page="customer"/>
					<functions.IceSelector selectedIce={ice} setSelectedIce={setIce} details={OrderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx} page="customer"/>
					<functions.SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} details={OrderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx} page="customer"/>
				
					<button onClick={() => {
						const updated = [...OrderDetails];
						const idx = currentEditIdx != null ? currentEditIdx : OrderDetails.length - 1;
						updated[idx] = {
							...updated[idx],
							size,
							ice,
							sweetness
						};
						setorderDetails(updated);
						functions.defaultVal(updated, setorderDetails);
						setToppingMode("linked");
						setScreen("customer-toppings"); // NEEDS TO GO TO CUSTOMER TOPPINGS PAGE
						}}
						style={{
							padding: "10px 20px",
							borderRadius: "15px",
							backgroundColor: "#38bdf8",
							color: "white",
							border: "none",
							fontWeight: "bold",
							cursor: "pointer",
							width: "fit-content",
							marginTop: "10px"
						}}
					>
						Select Toppings
					</button>

					<button
					onClick={() => {
						setScreen("confirm");
						functions.defaultVal(OrderDetails, setorderDetails);
					}}
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
					Done
				</button>
				
				</div>
				</tr>
				</table>
			</div>
		</div>
	);
}

export default CustomerCustomization;
