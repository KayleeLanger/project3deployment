import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png";
import * as functions from "./functions.js";
import { getDrinkImage } from "./functions.js";

function ItemConfirm({ setScreen, OrderDetails, setorderDetails, setCurrentEditIdx, selectedCategory, setSelectedCategory, setToppingMode }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const lastIdx = OrderDetails.length - 1;
    const lastItem = OrderDetails[lastIdx];

    const [sweetness, setSweetness] = useState("");
    const [ice, setIce] = useState("");
    const [toppings, setToppings] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (lastItem) {
            setSweetness(lastItem.sweetness || "");
            setIce(lastItem.ice || "");

            if (typeof lastItem.toppings === "string") {
                setToppings(lastItem.toppings.split(", "));
            } else {
                setToppings([]);
            }
        }
    }, [lastItem]);

    const handleAddToOrder = () => {
        const updated = [...OrderDetails];
        updated[lastIdx] = {
            ...updated[lastIdx],
            sweetness,
            ice,
            toppings: toppings.join(", ")
        };
        setorderDetails(updated);
        setScreen("customer-drinks");
    };

    const subtotal = OrderDetails.reduce((subtotal, order) => {
        const price = parseFloat(order.price);
        const qty = parseInt(order.quantity);
        return !isNaN(price) ? subtotal + price * qty : subtotal;
    }, 0);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // const categories = [
    //     { name: "Milk Tea" }, { name: "Brewed Tea" }, { name: "Ice Blended" },
    //     { name: "Fresh Milk" }, { name: "Fruit Tea" }, { name: "Tea Mojito" },
    //     { name: "Crema" }, { name: "Seasonal" }, { name: "Miscellaneous" }
    // ];

    const categories = [
        { name: "Milk Tea" }, { name: "Brewed Tea" }, { name: "Ice Blended" },
        { name: "Fresh Milk" }, { name: "Fruit Tea" }, { name: "Tea Mojito" },
        { name: "Seasonal" }, { name: "Miscellaneous" }
    ];

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div className="sidebar">
                <div className="time-box">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <strong>{currentTime.toLocaleDateString()}</strong>
                </div>

                {categories.map((category) =>
                    category.name === selectedCategory ? (
                        <functions.SpecialSideButton
                            key={category.name}
                            text={category.name}
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setScreen("customer-drinks");
                            }}
                        />
                    ) : (
                        <functions.SideButton
                            key={category.name}
                            text={category.name}
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setScreen("customer-drinks");
                            }}
                        />
                    )
                )}

                <functions.SideButton
                    text="Individual Toppings"
                    onClick={() => {
                        setToppingMode("standalone");
                        setScreen("customer-toppings");
                    }}
                />

                <functions.SideButton onClick={() => setScreen("home")} />
            </div>

            <div className="main" style={{ marginLeft: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ color: "black", fontSize: "40px", marginBottom: "100px" }}>{lastItem.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                <img
                    src={
                        lastItem.ice === "-"
                            ? functions.getMiscImage(lastItem.name) //Misc item
                            : functions.getDrinkImage(lastItem.name) //Regular drink
                    }
                    alt={lastItem.name}
                    style={{ width: "150px", height: "150px", objectFit: "contain" }}
                />
                    <div style={{ textAlign: "left", fontSize: "18px" }}>
                        {ice === "n/a" && sweetness === "n/a" && (
                            <p><strong>Type:</strong> Individual Topping</p>
                        )}
                        {ice === "-" && (
                            <p><strong>Type:</strong> Miscellaneous Item</p>
                        )}
                        {ice !== "n/a" && ice !== "-" && (
                            <>
                                <p><strong>Size:</strong> {lastItem.size}</p>
                                <p><strong>Sweetness:</strong> {sweetness}</p>
                                <p><strong>Ice:</strong> {ice}</p>
                                <p><strong>Toppings:</strong> {toppings.join(", ") || "None"}</p>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px", width: "300px" }}>
                    <button
                        onClick={() => setScreen("customer-customization")}
                        style={{ backgroundColor: "#ccc", padding: "15px", fontSize: "18px", borderRadius: "15px" }}
                    >
                        Edit Customizations
                    </button>
                </div>
            </div>

            <div className="order">
                <h1>Order Details</h1>
                {OrderDetails && OrderDetails.length > 0 ? (
                    OrderDetails.map((order, index) => (
                        <>
                            <div className="order-item">
                                <div className="order-left">
                                    <functions.Button
                                        text="X"
                                        onClick={() => {
                                            functions.deleteItem(index, OrderDetails, setorderDetails, setScreen, "customer");
                                            console.log("Delete button clicked for", order.name);
                                        }}
                                    />
                                    <div className="quantity">
                                        <button
                                            onClick={() => {
                                                const updated = [...OrderDetails];
                                                const currentQty = parseInt(order.quantity) || 1;
                                                updated[index].quantity = Math.max(1, currentQty - 1);
                                                setorderDetails(updated);
                                            }}
                                            style={{ backgroundColor: "#38bdf8"}}
                                        >–</button>

                                        <input
                                            type="number"
                                            min="1"
                                            className="quantity-input"
                                            value={order.quantity}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value) || 1;
                                                const updated = [...OrderDetails];
                                                updated[index].quantity = newQty;
                                                setorderDetails(updated);
                                            }}
                                        />

                                        <button
                                            onClick={() => {
                                                const updated = [...OrderDetails];
                                                const currentQty = parseInt(order.quantity) || 1;
                                                updated[index].quantity = currentQty + 1;
                                                setorderDetails(updated);
                                            }}
                                            style={{ backgroundColor: "#38bdf8"}}
                                        >+</button>
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

                                <functions.Button
                                    text="Edit"
                                    onClick={() => {
                                        functions.editItem(index, setCurrentEditIdx, setScreen, "customer");
                                        console.log("Edit button clicked for", order.name);
                                    }}
                                />
                            </div>
                        </>
                    ))
                ) : (
                    <p>No items</p>
                )}

                <div className="order-total" style={{ textAlign: "right", color: "black" }}>                    
                    <h3>Subtotal: ${subtotal.toFixed(2)} </h3>
                    <h3>Tax: ${tax.toFixed(2)} </h3>
                    <h2>Total: ${total.toFixed(2)}</h2>
                </div>

                <functions.Button
                    text="Add More"
                    onClick={() => {
                        setScreen("customer");
                        functions.defaultVal(OrderDetails, setorderDetails);
                        setCurrentEditIdx(null);
                    }}
                />

                <functions.Button
                    text="Checkout"
                    onClick={() => {
                        setScreen("customer-checkout");
                    }}
                />
            </div>
        </div>
    );
}

export default ItemConfirm;
