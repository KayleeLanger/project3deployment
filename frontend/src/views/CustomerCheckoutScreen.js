import { useEffect, useState } from "react";
import "./Customer.css";
import * as functions from "./functions.js";
import logo from "./Images/team_00_logo.png";
import { getDrinkImage, getToppingImage, getAllergenWarnings, getStandaloneAllergenWarnings } from "./functions.js";
import LargeTextButtons from "./LargeTextButton.js";

function CustomerCheckoutScreen({ setScreen, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [seasonalDrink, setSeasonalDrink] = useState(null);
    const [offerUsed, setOfferUsed] = useState(false);
    const [drinkIngredientsMap, setDrinkIngredientsMap] = useState({});

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

    const subtotal = OrderDetails.reduce((subtotal, order) => {
        const price = parseFloat(order.price);
        const qty = parseInt(order.quantity || 1);
        return !isNaN(price) ? subtotal + price * qty : subtotal;
    }, 0);

    const freeToppingsEarned = Math.floor(subtotal / 25);
    const nextThreshold = (freeToppingsEarned + 1) * 25;
    const amountToNextFreeTopping = nextThreshold - subtotal;
    const freeToppingDiscount = freeToppingsEarned * 0.50;
    const tax = (subtotal - freeToppingDiscount) * 0.08;
    const total = subtotal - freeToppingDiscount + tax;
    const seasonalDiscountPercent = 0.10;
    const seasonalDiscount = subtotal * seasonalDiscountPercent;

    const handlePlaceOrder = () => {
        const totalItems = OrderDetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
        functions.checkout(totalItems, total.toFixed(2), OrderDetails);
        alert(`Thanks for your order!\n\nTotal: $${total.toFixed(2)}`);
        setorderDetails([]);
        setScreen("customer");
    };

    const handleAddSeasonalDrink = () => {
        if (!seasonalDrink || offerUsed) return;
        const discountedPrice = parseFloat(seasonalDrink.drinkprice) - seasonalDiscount;
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
            <div className="sidebar">
                <div className="time-box">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <strong>{currentTime.toLocaleDateString()}</strong>
                </div>
                <functions.WeatherEntry/>
                <functions.SideButton text="Back to Item Confirmation" onClick={() => setScreen("confirm")} />
                <functions.SideButton text="Back to Drinks" onClick={() => setScreen("customer-drinks")} />
                <functions.SideButton text="Home" onClick={() => setScreen("customer")} />
            </div>

            <div className="homeScreenCheckout" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <LargeTextButtons/>
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
                </div>

                <h1 style={{ textAlign: "center" }}>Review Your Order</h1>

                <div style={{ flex: "1 1 auto", overflowY: "auto", padding: "10px 20px", marginBottom: "20px" }}>
                    {OrderDetails.length > 0 ? (
                        OrderDetails.map((item, index) => {
                            const toppingList = item.toppings && item.toppings !== "none"
                                ? item.toppings.split(", ").map(name => name.split(" (")[0].trim())
                                : [];

                            let allergens = "";
                            if (item.ice === "n/a") {
                                allergens = getStandaloneAllergenWarnings(item.name);
                            } else {
                                const drinkIngredients = drinkIngredientsMap[item.name] || [];
                                let toppingIngredients = [];
                                toppingList.forEach(topping => {
                                    if (drinkIngredientsMap[topping]) {
                                        toppingIngredients = toppingIngredients.concat(drinkIngredientsMap[topping]);
                                    }
                                });
                                const combinedIngredients = [...drinkIngredients, ...toppingIngredients, ...toppingList];
                                allergens = getAllergenWarnings(combinedIngredients);
                            }

                            return (
                                <div key={index} className="order-item" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                    <img src={
                                        item.image ||
                                        (item.ice === "n/a"
                                            ? functions.getToppingImage(item.name)
                                            : item.ice === "-"
                                                ? functions.getMiscImage(item.name)
                                                : functions.getDrinkImage(item.name)) || logo
                                    }
                                    alt={item.name}
                                    style={{ width: "80px", height: "80px", marginRight: "20px", objectFit: "contain" }}
                                    />
                                    <div style={{ textAlign: "left", flexGrow: 1 }}>
                                        <strong>{item.name}</strong>
                                        {item.ice !== "n/a" && item.ice !== "-" && (
                                            <>
                                                <p>Size: {item.size}</p>
                                                <p>Sweetness: {item.sweetness}</p>
                                                <p>Ice: {item.ice}</p>
                                                <p>Toppings: {item.toppings}</p>
                                                {allergens && (
                                                    <p style={{ color: "#b91c1c", fontSize: "14px" }}>⚠️ {allergens}</p>
                                                )}
                                            </>
                                        )}
                                        {item.ice === "n/a" && (
                                            <>
                                                <p>Type: Individual Topping</p>
                                                {allergens && (
                                                    <p style={{ color: "#b91c1c", fontSize: "14px" }}>⚠️ {allergens}</p>
                                                )}
                                            </>
                                        )}
                                        {item.ice === "-" && <p>Miscellaneous Item</p>}
                                        <p>Quantity: {item.quantity || 1}</p>
                                        <p>Price: ${item.price}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>

                <div style={{ flexShrink: 0, padding: "10px 40px", textAlign: "right" }}>
                    <hr />
                    <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                    {freeToppingsEarned > 0 && (
                        <p style={{ color: "#22c55e" }}>
                            <strong>Free Toppings:</strong> {freeToppingsEarned} (-${freeToppingDiscount.toFixed(2)})
                        </p>
                    )}
                    {amountToNextFreeTopping > 0 && (
                        <p style={{ color: "#b91c1c" }}>
                            Spend ${amountToNextFreeTopping.toFixed(2)} more (pre-tax) to unlock another free topping!
                        </p>
                    )}
                    <p><strong>Tax (8%):</strong> ${tax.toFixed(2)}</p>
                    <h2><strong>Total:</strong> ${total.toFixed(2)}</h2>
                </div>

                {seasonalDrink && !seasonalInOrder && !offerUsed && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#b91c1c" }}>
                            Add the seasonal drink <i>{seasonalDrink.drinkname}</i> for only <strong>${Math.max(0, (parseFloat(seasonalDrink.drinkprice) - seasonalDiscount)).toFixed(2)}</strong>?
                        </p>
                        <button
                            onClick={handleAddSeasonalDrink}
                            style={{ padding: "12px 24px", backgroundColor: "#fbbf24", color: "black", fontWeight: "bold", borderRadius: "10px", fontSize: "16px", marginTop: "10px" }}
                        >
                            Add Seasonal Drink
                        </button>
                    </div>
                )}

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <functions.Button text="Place Order" onClick={handlePlaceOrder} />
                </div>
            </div>
        </div>
    );
}

export default CustomerCheckoutScreen;
