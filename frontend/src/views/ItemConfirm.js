import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png";
import * as functions from "./functions.js";
import { getDrinkImage, getAllergenWarnings } from "./functions.js";
import LargeTextButtons from "./LargeTextButton.js";

function ItemConfirm({ setScreen, OrderDetails, setorderDetails, setCurrentEditIdx, selectedCategory, setSelectedCategory, setToppingMode }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const lastIdx = OrderDetails.length - 1;
    const lastItem = OrderDetails[lastIdx];

    const [sweetness, setSweetness] = useState("");
    const [ice, setIce] = useState("");
    const [toppings, setToppings] = useState([]);
    const [drinkIngredientsMap, setDrinkIngredientsMap] = useState({});

    const baseCalories = lastItem?.baseCalories || 300;
    const sizeCalories = lastItem?.size?.toLowerCase() === "large" ? baseCalories + 300 : baseCalories;

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

    useEffect(() => {
        async function fetchIngredients() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/drink-ingredients`);
                const data = await res.json();
                const newMap = {};
                data.forEach(entry => {
                    if (!newMap[entry.drinkname]) {
                        newMap[entry.drinkname] = [];
                    }
                    newMap[entry.drinkname].push(entry.inventoryid);
                });
                setDrinkIngredientsMap(newMap);
            } catch (err) {
                console.error("Failed to fetch drink ingredients:", err);
            }
        }
        fetchIngredients();
    }, []);

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
                <functions.WeatherEntry/>

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

                {selectedCategory === "toppings" ? (
                    <functions.SpecialSideButton
                        text="Individual Toppings"
                        onClick={() => {
                            setSelectedCategory("toppings");
                            setToppingMode("standalone");
                            setScreen("customer-toppings");
                        }}
                    />
                ) : (
                    <functions.SideButton
                    text="Individual Toppings"
                    onClick={() => {
                        setSelectedCategory("toppings");
                        setToppingMode("standalone");
                        setScreen("customer-toppings");
                    }}
                />
                )}

                <functions.SideButton
                    text="Home"
                    onClick={() => setScreen("home")}
                />
            </div>

            <div className="mainCustomization">
                <LargeTextButtons/>
                <h1 style={{ color: "black", fontSize: "40px", marginBottom: "100px" }}>{lastItem.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                    <img
                        src={
                            lastItem.ice === "n/a"
                                ? functions.getToppingImage(lastItem.name)
                                : lastItem.ice === "-"
                                ? functions.getMiscImage(lastItem.name)
                                : getDrinkImage(lastItem.name)
                        }
                        alt={lastItem.name}
                        style={{ width: "150px", height: "150px", objectFit: "contain" }}
                    />
                    <div style={{ textAlign: "left", fontSize: "18px" }}>
                        {ice === "n/a" && sweetness === "n/a" && (
                            <>
                                <p><strong>Type:</strong> Individual Topping</p>
                                {(lastItem.name === "Ice Cream" || lastItem.name === "Crema") && (
                                    <p style={{ color: "#b91c1c", fontSize: "14px", marginTop: "5px" }}>⚠️ Contains Dairy</p>
                                )}
                            </>
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
                                <p><strong>Calories:</strong> {sizeCalories}</p>

                                {(() => {
                                    let allergens = "";
                                    if (lastItem) {
                                        const drinkIngredients = lastItem.name && drinkIngredientsMap[lastItem.name] ? drinkIngredientsMap[lastItem.name] : [];
                                        const toppingList = lastItem.toppings && lastItem.toppings !== "none"
                                            ? lastItem.toppings.split(", ").map(name => name.split(" (" )[0].trim())
                                            : [];

                                        let toppingIngredients = [];
                                        toppingList.forEach(topping => {
                                            if (drinkIngredientsMap[topping]) {
                                                toppingIngredients = toppingIngredients.concat(drinkIngredientsMap[topping]);
                                            }
                                        });

                                        const combinedIngredients = [...drinkIngredients, ...toppingIngredients];

                                        allergens = getAllergenWarnings([...combinedIngredients, ...toppingList]);
                                    }
                                    return allergens ? (
                                        <p style={{ color: "#b91c1c", fontSize: "14px", marginTop: "5px" }}>⚠️ {allergens}</p>
                                    ) : null;
                                })()}

                                <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px", width: "300px" }}>
                                    <button
                                        onClick={() => {
                                            setScreen("customer-customization");
                                            functions.editItem(OrderDetails.length - 1, setCurrentEditIdx, setScreen, "customer");
                                        }}
                                        style={{ backgroundColor: "#ccc", padding: "15px", fontSize: "18px", borderRadius: "15px" }}
                                    >
                                        Edit Customizations
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="order">
                <h1>Order Details</h1>
                {OrderDetails && OrderDetails.length > 0 ? (
                    OrderDetails.map((order, index) => {
                        return (
                            <div key={index} className="order-item">
                                <div className="order-left">
                                    <functions.Button
                                        text="X"
                                        onClick={() => functions.deleteItem(index, OrderDetails, setorderDetails, setScreen, "customer")}
                                    />
                                    <div className="quantity">
                                        <button
                                            onClick={() => {
                                                const updated = [...OrderDetails];
                                                const currentQty = parseInt(order.quantity) || 1;
                                                updated[index].quantity = Math.max(1, currentQty - 1);
                                                setorderDetails(updated);
                                            }}
                                            style={{ backgroundColor: "#38bdf8" }}
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
                                            style={{ backgroundColor: "#38bdf8" }}
                                        >+</button>
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="order-header">
                                        <h3>{order.name}</h3>
                                        <h3>${order.price}</h3>
                                    </div>
                                    {order.ice !== "n/a" && order.ice !== "-" ? (
                                        <p>
                                            <strong>Size:</strong> {order.size} <br />
                                            <strong>Ice:</strong> {order.ice} <br />
                                            <strong>Sweetness:</strong> {order.sweetness} <br />
                                            <strong>Toppings:</strong> {order.toppings} <br />
                                        </p>
                                    ) : (
                                        <p>
                                            <br />
                                            <br />
                                        </p>
                                    )}
                                </div>

                                {order.ice !== "n/a" && order.ice !== "-" && (
                                    <functions.Button
                                        text="Edit"
                                        onClick={() => functions.editItem(index, setCurrentEditIdx, setScreen, "customer")}
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No items</p>
                )}

                <div className="order-total" style={{ textAlign: "right", color: "black" }}>
                    <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
                    <h3>Tax: ${tax.toFixed(2)}</h3>
                    <h2>Total: ${total.toFixed(2)}</h2>
                </div>

                <functions.Button
                    text="Add More"
                    onClick={() => {
                        setScreen("customer");
                        functions.defaultVal(OrderDetails, setorderDetails);
                        setCurrentEditIdx(null);
                    }}
                    style = {{marginTop: "40px" }}
                />

                <functions.Button
                    text="Checkout"
                    onClick={() => setScreen("customer-checkout")}
                    style={{ marginBottom: "100px"}}
                />
            </div>
        </div>
    );
}

export default ItemConfirm;
