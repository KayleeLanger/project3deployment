import { useEffect, useState } from "react";
import "./Customer.css";
import * as functions from "./functions.js";
import logo from "./Images/team_00_logo.png"; // placeholder for now

function CustomerCheckoutScreen({ setScreen, OrderDetails, setorderDetails }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	const subtotal = OrderDetails.reduce((subtotal, order) => {
		const price = parseFloat(order.price);
		const qty = parseInt(order.quantity);
		return !isNaN(price) ? subtotal + price * qty : subtotal;
	}, 0);

	const tax = subtotal * 0.08;
	const total = subtotal + tax;

	const handlePlaceOrder = () => {
		const totalItems = OrderDetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
		functions.checkout(totalItems, total.toFixed(2));
		alert(`Thanks for your order!\n\nTotal: $${total.toFixed(2)}`);
		setorderDetails([]);
		setScreen("customer");
	};

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Sidebar */}
			<div className="sidebar">
				<div className="time-box">
					<h2>{currentTime.toLocaleTimeString()}</h2>
					<strong>{currentTime.toLocaleDateString()}</strong>
				</div>
				<functions.SideButton text="Back to Drinks" onClick={() => setScreen("customer-drinks")} />
				<functions.SideButton text="Home" onClick={() => setScreen("customer")} />
			</div>

			{/* Main Content */}
			<div className="homeScreen">
				<functions.XButton text="X" onClick={() => setScreen("customer")} />
				<h1>Review Your Order</h1>

				<div className="mainBody">
					{OrderDetails.length > 0 ? (
						OrderDetails.map((item, index) => (
							<div key={index} className="order-item">
								<img src={logo} alt="drink" />
								<div className="order-item-info">
									<strong>{item.name}</strong>
									<p>Size: {item.size}</p>
									<p>Sweetness: {item.sweetness}</p>
									<p>Ice: {item.ice}</p>
									<p>Toppings: {item.toppings}</p>
									<p>Quantity: {item.quantity}</p>
									<p>Price: ${item.price}</p>
								</div>
							</div>
						))
					) : (
						<p>Your cart is empty.</p>
					)}

					<hr />

					<div className="order-total-summary">
						<p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
						<p><strong>Tax (8%):</strong> ${tax.toFixed(2)}</p>
						<h2><strong>Total:</strong> ${total.toFixed(2)}</h2>
					</div>

					<div className="checkout-button-container">
						<functions.Button text="Place Order" onClick={handlePlaceOrder} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default CustomerCheckoutScreen;
