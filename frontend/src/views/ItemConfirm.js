import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png";

function ItemConfirm({ setScreen, OrderDetails, setorderDetails }) {
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
            setToppings(lastItem.toppings ? lastItem.toppings.split(", ") : []);
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
        setScreen("customer-drinks"); // SET TO CHECKOUT SCREEN (IF ITEM HAS BEEN ADDED TO ORDER)
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="time-box">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <strong>{currentTime.toLocaleDateString()}</strong>
                </div>
                <button onClick={() => setScreen("customer-customization")}>Back</button>
            </div>

            {/* Main confirmation content */}
            <div className="main" style={{ marginLeft: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>{lastItem.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                    <img
                        src={logo}
                        alt={lastItem.name}
                        style={{ width: "150px", height: "150px", objectFit: "contain" }}
                    />
                    <div style={{ textAlign: "left", fontSize: "18px" }}>
                        <p><strong>Sweetness:</strong> {sweetness}</p>
                        <p><strong>Ice:</strong> {ice}</p>
                        <p><strong>Toppings:</strong> {toppings.join(", ") || "None"}</p>
                    </div>
                </div>

                <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px", width: "300px" }}>
                    <button
                        onClick={() => setScreen("customer-customization")}
                        style={{ backgroundColor: "#ccc", padding: "15px", fontSize: "18px", borderRadius: "15px" }}
                    >
                        Edit Customizations
                    </button>
                    <button
                        onClick={handleAddToOrder}
                        style={{ backgroundColor: "#38bdf8", padding: "15px", fontSize: "18px", borderRadius: "15px", color: "white" }}
                    >
                        Add To Order
                    </button>
                </div>
            </div>

            {/* Order summary panel */}
            <div className="order">
                <h2>Order Details</h2>
                {OrderDetails.length === 0 ? (
                    <p>No items added</p>
                ) : (
                    OrderDetails.map((item, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <strong>{item.name}</strong><br />
                            {item.sweetness}, {item.ice}, {item.toppings}
                        </div>
                    ))
                )}
                <button>Checkout</button>
            </div>
        </div>
    );
}

export default ItemConfirm;
