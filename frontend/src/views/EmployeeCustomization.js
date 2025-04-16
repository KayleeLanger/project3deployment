import { useState, useEffect } from "react";
import "./Employee.css"; 
import * as functions from "./functions.js";

function EmployeeCustomization({ setScreen, selectedCategory, OrderDetails, setorderDetails, currentEditIdx, setCurrentEditIdx }) {
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

	// to make sure that correct item is edited (whether or not edit is clicked)
	useEffect(() => {
		const idx = currentEditIdx != null ? currentEditIdx : orderdetails.length - 1;
		if (orderdetails[idx]) {
			const item = orderdetails[idx];
			setSize(item.size || "");
			setIce(item.ice || "");
			setSweetness(item.sweetness || "");
		}
	}, [currentEditIdx, orderdetails]);
	

	const subtotal = orderdetails.reduce((subtotal, order) => {
		const price = parseFloat(order.price);
		const qty = parseInt(order.quantity);
		return !isNaN(price) ? subtotal + price * qty: subtotal;
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
					setCurrentEditIdx(null);
				}} />
			</tr><tr>
				{/* Clear order and start over */}
				<functions.Button text="Clear Order" onClick={() => {
					setScreen("cashier");
					setorderDetails([]);
					setCurrentEditIdx(null);
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
			<functions.SizeSelector selectedSize={size} setSelectedSize={setSize} details={orderdetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>
			<functions.IceSelector selectedIce={ice} setSelectedIce={setIce} details={orderdetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>
			<functions.SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} details={orderdetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>

			<button onClick={() => {
				const updated = [...orderdetails];
				const idx = currentEditIdx != null ? currentEditIdx : orderdetails.length - 1;
				updated[idx] = {
					...updated[idx],
					size,
					ice,
					sweetness
				};
				setorderDetails(updated);
				functions.defaultVal(updated, setorderDetails);
				setScreen("cashier-toppings");
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
			</div>
		</div>
		</div>
	
	
	
			
		{/* Order Results */}
		<div className="order">
			<h1>Order Summary</h1>
			{/* loop through order items and display */}
				{orderdetails && orderdetails.length > 0 ? (
					orderdetails.map((order, index) => ( <>
						<div className="order-item">
							<div className = "order-left">
								{/* Delete button */}
							<functions.Button text="X" 
								onClick={() => {
								functions.deleteItem(index, orderdetails, setorderDetails, setScreen);
								console.log("Delete button clicked for", order.name);
								}} 
							/>
							<div className = "quantity">
								<button
								onClick={() => {
									const updated = [...orderdetails];
									const currentQty = parseInt(order.quantity) || 1;
									updated[index].quantity = Math.max(1, currentQty - 1);
									setorderDetails(updated);
								}}
								style={{ backgroundColor: "#38bdf8"}}
								>
								–
								</button>

								<input
								type="number"
								min="1"
								className="quantity-input"
								value={order.quantity}
								onChange={(e) => {
									const newQty = parseInt(e.target.value) || 1;
									const updated = [...orderdetails];
									updated[index].quantity = newQty;
									setorderDetails(updated);
								}}
								/>

								<button
								onClick={() => {
									const updated = [...orderdetails];
									const currentQty = parseInt(order.quantity) || 1;
									updated[index].quantity = currentQty + 1;
									setorderDetails(updated);
								}}
								style={{ backgroundColor: "#38bdf8"}}
								>
								+
								</button>
							</div>
							</div>
							<div className = "order-content">
								<div className="order-header">
									<h3>{order.name}</h3>
									<h3>${order.price}</h3>
								</div>
								{ /* don't add options and edit if topping or misc */}
								{order.ice !== "n/a" && order.ice !== "-" && (
									<p>
										<strong>Size:</strong> {order.size} <br />
										<strong>Ice:</strong> {order.ice} <br />
										<strong>Sweetness:</strong> {order.sweetness} <br />
										<strong>Toppings:</strong> {order.toppings}
									</p>
								)}
							</div>
							{/* Edit item button */}
							{order.ice !== "n/a" && order.ice !== "-" && (
								<functions.Button text="Edit" 
									onClick={() => {
										functions.editItem(index, setCurrentEditIdx, setScreen);
										console.log("Edit button clicked for", order.name);
									}} 
								/>
							)}
						</div>
					</>
					))
				) : (
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
					setCurrentEditIdx(null);
				}} />

			<functions.Button text="Checkout" 
				onClick={() => {
					const totalItems = orderdetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
					functions.checkout(totalItems , total.toFixed(2));
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
