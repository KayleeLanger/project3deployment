import { useEffect, useState } from "react";
import "./Customer.css";
import * as functions from "./functions.js";
import logo from "./Images/team_00_logo.png";
import { getDrinkImage } from "./functions.js";

function CustomerCheckoutScreen({ setScreen, OrderDetails, setorderDetails }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [seasonalDrink, setSeasonalDrink] = useState(null);
	const [offerUsed, setOfferUsed] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/Seasonal`)
			.then(res => res.json())
			.then(data => {
				if (data.length > 0) setSeasonalDrink(data[0]);
			})
			.catch(err => console.error("Failed to fetch seasonal drink:", err));
	}, []);

	const subtotal = OrderDetails.reduce((subtotal, order) => {
		const price = parseFloat(order.price);
		const qty = parseInt(order.quantity || 1);
		return !isNaN(price) ? subtotal + price * qty : subtotal;
	}, 0);

	const tax = subtotal * 0.08;
	const total = subtotal + tax;
	const discount = subtotal * 0.15;

	const handlePlaceOrder = () => {
		const totalItems = OrderDetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
		functions.checkout(totalItems, total.toFixed(2));
		alert(`Thanks for your order!\n\nTotal: $${total.toFixed(2)}`);
		setorderDetails([]);
		setScreen("customer");
	};

	const handleAddSeasonalDrink = () => {
		if (!seasonalDrink || offerUsed) return;

		const discountedPrice = parseFloat(seasonalDrink.drinkprice) - discount;
		const rounded = Math.max(0, discountedPrice).toFixed(2);

		const newItem = {
			name: seasonalDrink.drinkname,
			price: rounded,
			size: "regular",
			sweetness: "100%",
			ice: "regular",
			toppings: "none",
			quantity: 1
		};

		setorderDetails(prev => [...prev, newItem]);
		setOfferUsed(true);
	};

	const seasonalInOrder = OrderDetails.some(item => item.name === seasonalDrink?.drinkname);

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
			<functions.XButton
				text="X"
				onClick={() => {
					const confirmClear = window.confirm("Are you sure you want to cancel your order and return to the home screen?");
					if (confirmClear) {
						setorderDetails([]);
						setScreen("customer");
					}
				}}
			/>
				<h1>Review Your Order</h1>

				<div className="mainBody" style={{ width: "100%" }}>
					{OrderDetails.length > 0 ? (
						OrderDetails.map((item, index) => (
							<div key={index} className="order-item" style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
								<img src={getDrinkImage(item.name) || logo} alt="drink" style={{ width: "100px", height: "100px", marginRight: "20px" }} />
								<div className="order-item-info" style={{ textAlign: "left" }}>
									<strong>{item.name}</strong>
									<p>Size: {item.size}</p>
									<p>Sweetness: {item.sweetness}</p>
									<p>Ice: {item.ice}</p>
									<p>Toppings: {item.toppings}</p>
									<p>Quantity: {item.quantity || 1}</p>
									<p>Price: ${item.price}</p>
								</div>
							</div>
						))
					) : (
						<p>Your cart is empty.</p>
					)}

					<hr />

					<div className="order-total-summary" style={{ textAlign: "right", paddingRight: "40px" }}>
						<p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
						<p><strong>Tax (8%):</strong> ${tax.toFixed(2)}</p>
						<h2><strong>Total:</strong> ${total.toFixed(2)}</h2>
					</div>

					{/*Seasonal drink upsell offer */}
					{seasonalDrink && !seasonalInOrder && !offerUsed && (
						<div style={{ marginTop: "30px", textAlign: "center" }}>
							<p style={{ fontSize: "18px", fontWeight: "bold", color: "#b91c1c" }}>
								Add the seasonal drink <i>{seasonalDrink.drinkname}</i> for only <strong>${Math.max(0, (parseFloat(seasonalDrink.drinkprice) - discount)).toFixed(2)}</strong>?
							</p>
							<button
								onClick={handleAddSeasonalDrink}
								style={{
									padding: "12px 24px",
									backgroundColor: "#fbbf24",
									color: "black",
									fontWeight: "bold",
									borderRadius: "10px",
									fontSize: "16px"
								}}
							>
								Add Seasonal Drink
							</button>
						</div>
					)}

					<div className="checkout-button-container" style={{ marginTop: "40px", textAlign: "center" }}>
						<functions.Button text="Place Order" onClick={handlePlaceOrder} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default CustomerCheckoutScreen;
