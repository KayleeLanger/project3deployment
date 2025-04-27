import { useState, useEffect } from "react";
import "./Employee.css";
import * as functions from "./functions.js";

function EmployeeCategoryScreen({ setScreen, setSelectedCategory, orderDetails, setorderDetails, setCurrentEditIdx }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    const categories = [
        { name: "Milk Tea" }, { name: "Brewed Tea" }, { name: "Ice Blended" },
        { name: "Fresh Milk" }, { name: "Fruit Tea" }, { name: "Tea Mojito" },
        { name: "Seasonal" }, { name: "Toppings" }, { name: "Miscellaneous" }
    ];

    const subtotal = orderDetails.reduce((subtotal, order) => {
        const price = parseFloat(order.price);
        const qty = parseInt(order.quantity);
        return !isNaN(price) ? subtotal + price * qty : subtotal;
    }, 0);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="sidebar">
                <table>
                    <tr>
                        <div className="time-box">
                            <h2>{currentTime.toLocaleTimeString()}</h2>
                            <strong>{currentTime.toLocaleDateString()}</strong>
                        </div>
                    </tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr><h1>   </h1></tr>
                    <tr>
                        <functions.Button text="Clear Order" onClick={() => {
                            setScreen("cashier");
                            setorderDetails([]);
                        }} />
                    </tr>
                    <tr>
                        <functions.Button text="Logout" onClick={() => setScreen("home")} />
                    </tr>
                </table>
            </div>

            <div className="container">
                <div className="main">
                    <h1>Cashier Categories<br /></h1>
                    <div className="mainBody">
                        {categories.map(category => (
                            <div className="buttonBox" key={category.name}>
                                <functions.CategoryButton
                                    text={category.name}
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        if (category.name === "Toppings") {
                                            setScreen("cashier-toppings");
                                            setorderDetails(prevDetails => [
                                                ...prevDetails,
                                                {
                                                    name: "Topping Only",
                                                    price: "",
                                                    size: "n/a",
                                                    ice: "n/a",
                                                    sweetness: "n/a",
                                                    toppings: "n/a",
                                                    quantity: "1"
                                                }
                                            ]);
                                        } else {
                                            setScreen("cashier-drinks");
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="order">
                <h1>Order Summary</h1>
                {orderDetails && orderDetails.length > 0 ? (
                    <>
                        {orderDetails.map((order, index) => (
                            <div className="order-item" key={index}>
                                <div className="order-left">
                                    <functions.Button text="X" onClick={() => {
                                        functions.deleteItem(index, orderDetails, setorderDetails);
                                        console.log("Delete button clicked for", order.name);
                                    }} />
                                    <div className="quantity">
                                        <button onClick={() => {
                                            const updated = [...orderDetails];
                                            const currentQty = parseInt(order.quantity) || 1;
                                            updated[index].quantity = Math.max(1, currentQty - 1);
                                            setorderDetails(updated);
                                        }} style={{ backgroundColor: "#38bdf8" }}>–</button>

                                        <input
                                            type="number"
                                            min="1"
                                            className="quantity-input"
                                            value={order.quantity}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value) || 1;
                                                const updated = [...orderDetails];
                                                updated[index].quantity = newQty;
                                                setorderDetails(updated);
                                            }}
                                        />

                                        <button onClick={() => {
                                            const updated = [...orderDetails];
                                            const currentQty = parseInt(order.quantity) || 1;
                                            updated[index].quantity = currentQty + 1;
                                            setorderDetails(updated);
                                        }} style={{ backgroundColor: "#38bdf8" }}>+</button>
                                    </div>
                                </div>
                                <div className="order-content">
                                    <div className="order-header">
                                        <h3>{order.name}</h3>
                                        <h3>${order.price}</h3>
                                    </div>
                                    {order.ice !== "n/a" && order.ice !== "-" && (
                                        <p>
                                            <strong>Size:</strong> {order.size} <br />
                                            <strong>Ice:</strong> {order.ice} <br />
                                            <strong>Sweetness:</strong> {order.sweetness} <br />
                                            <strong>Toppings:</strong> {order.toppings}
                                        </p>
                                    )}
                                </div>
                                {order.ice !== "n/a" && order.ice !== "-" && (
                                    <functions.Button text="Edit" onClick={() => {
                                        functions.editItem(index, setCurrentEditIdx, setScreen);
                                        console.log("Edit button clicked for", order.name);
                                    }} />
                                )}
                            </div>
                        ))}
                        <div className="order-total" style={{ textAlign: "right" }}>
                            <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
                            <h3>Tax: ${tax.toFixed(2)}</h3>
                            <h2>Total: ${total.toFixed(2)}</h2>
                        </div>
                    </>
                ) : (
                    <p>Add a Drink To Get Started!</p>
                )}

                <functions.Button text="Add More" onClick={() => {
                    setScreen("cashier");
                    functions.defaultVal(orderDetails, setorderDetails);
                }} />
                <functions.Button text="Checkout" onClick={() => {
                    const totalItems = orderDetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
                    functions.checkout(totalItems, total.toFixed(2), orderDetails);
                    functions.defaultVal(orderDetails, setorderDetails);
                    setScreen("cashier");
                    alert("Thanks for the order!\n\nOrder Total: $" + total.toFixed(2));
                    setorderDetails([]);
                }} />
            </div>
        </>
    );
}

export default EmployeeCategoryScreen;
