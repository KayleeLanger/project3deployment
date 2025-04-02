import { useState, useEffect } from "react";
import "./Employee.css"; 
import * as functions from "./functions.js";

function EmployeeCustomization({ setScreen, selectedCategory, OrderDetails, setorderDetails }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	
	//clock setup
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// needed variables for the backend (Felicia's tasks)
	const [size, setSize] = useState("");
	const [ice, setIce] = useState("");
	const [sweetness, setSweetness] = useState("");

	let orderdetails = [];
	if (OrderDetails.length > 0) {
		orderdetails = OrderDetails;
	}

	const subtotal = orderdetails.reduce((subtotal, order) => {
		const price = parseFloat(order.price);
		return !isNaN(price) ? subtotal + price: subtotal;
	}, 0);

	const tax = subtotal * 0.08;
	const total = subtotal + tax;

	return (
	<>
		{/* Sidebar (logout, time, cancel order)*/}
		<div className="sidebar">
			<table><tr>
			<div className="time-box">
				<h2>{currentTime.toLocaleTimeString()}</h2>
				<strong>{currentTime.toLocaleDateString()}</strong>
			</div>
			{/* probably should come up with a better way to do this */}
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			</tr><tr><h1>   </h1>
			
			</tr><tr>
				<functions.Button text="Remove Current Item" onClick={() => {
					setorderDetails(orderdetails.slice(0, orderdetails.length-1));
					setScreen("cashier");
				}} />
			</tr><tr>
				{/* Clear order and start over */}
				<functions.Button text="Clear Order" onClick={() => {
					setScreen("cashier");
					setorderDetails([]);
				}} />
			</tr><tr>
				<functions.Button text="Logout" onClick={() => setScreen("home")} />
			</tr></table>
		</div>
	
	
	
	
	
		{/* Main content */}
		<div className="container">
		  <div className="main">
			<h1>Customization<br></br></h1>
			<div className = "customization-options">
			{/* TODO: ADD CUSTOMIZATION FRONTEND! */}
			 <functions.SizeSelector selectedSize={size} setSelectedSize={setSize} details={orderdetails} setDetails={setorderDetails}/>
			 <functions.IceSelector selectedIce={ice} setSelectedIce={setIce} details={orderdetails} setDetails={setorderDetails} />
			 <functions.SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} details={orderdetails} setDetails={setorderDetails} />

			 <button onClick={() => ( 
				setScreen("cashier-toppings"), 
				functions.defaultVal(orderdetails, setorderDetails)
				)}
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
			</div>
			
		  </div>
		  </div>
	
	
	
			
		{/* Order Results */}
		<div className="order">
			<h1>Order Summary</h1>
			{/* loop through order items and display */}
				{orderdetails && orderdetails.length > 0 ? (
			orderdetails.map((orderdetails, index) => ( <>
			<div className="order-item">
				<div className="order-header">
				<h3>{orderdetails.name}</h3>
				<h3>${orderdetails.price}</h3>
				</div>
				{orderdetails.ice !== "n/a" && (
                	<p>
						<strong>Size:</strong> {orderdetails.size} <br />
						<strong>Ice:</strong> {orderdetails.ice} <br />
						<strong>Sweetness:</strong> {orderdetails.sweetness} <br />
						<strong>Toppings:</strong> {orderdetails.toppings}
                	</p>
                )}
			</div>
			</>
			))) : (
			<p>No items</p>
			)}
			{/* display order totals */}
			<div className = "order-total" style={{ textAlign: "right" }}>
				<h3>Subtotal: ${subtotal.toFixed(2)} </h3>
				<h3>Tax: ${tax.toFixed(2)} </h3>
				<h2>Total: ${total.toFixed(2)}</h2>
			</div>
	
			<functions.Button text="Add More" 
				onClick={() => {
					setScreen("cashier");
					functions.defaultVal(orderdetails, setorderDetails);
				}} />

			<functions.Button text="Checkout" 
				onClick={() => {
					functions.checkout(orderdetails.length , total.toFixed(2));
					functions.defaultVal(orderdetails, setorderDetails);
					setScreen("cashier"); 
					alert("Thanks for the order!\n\nOrder Total: $" + total.toFixed(2));
					setorderDetails([]);
				}} />
	
			</div>
		</>
	);
}



export default EmployeeCustomization;
