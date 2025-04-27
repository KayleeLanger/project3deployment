import { useState, useEffect } from "react";
import "./Employee.css";
import * as functions from "./functions.js";

function EmployeeDrinks({ setScreen, selectedCategory, orderDetails, setorderDetails, setCurrentEditIdx }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      getDrinks(selectedCategory);
    }
  }, [selectedCategory]);

  const getDrinks = async (category) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/${category}`);
      if (!response.ok) throw new Error("Failed to fetch drinks");
      const data = await response.json();
      console.log("data: ", data);
      setDrinks(data);
    } catch (error) {
      console.error(error);
      setDrinks([]);
    }
  };

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
      {/* Sidebar */}
      <div className="sidebar">
        <table><tbody><tr>
          <div className="time-box">
            <h2>{currentTime.toLocaleTimeString()}</h2>
            <strong>{currentTime.toLocaleDateString()}</strong>
          </div>
        </tr><tr><h1> </h1></tr>
        {/* spacing rows */}
        <tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr>
        <tr>
          <functions.Button text="Remove Current Item" onClick={() => setScreen("cashier")} />
        </tr><tr>
          <functions.Button text="Clear Order" onClick={() => {
            setScreen("cashier");
            setorderDetails([]);
          }} />
        </tr><tr>
          <functions.Button text="Logout" onClick={() => setScreen("home")} />
        </tr></tbody></table>
      </div>

      {/* Main */}
      <div className="container-drink">
        <div className="main">
          <functions.XButton text="X" onClick={() => setScreen("cashier")} />
          <h1>{selectedCategory}</h1>
          <div className="mainBody">
            {drinks.length > 0 ? (
              drinks.map(drink => (
                <div className="buttonBox" key={drink.name}>
                  <functions.DrinkButton
                    text={drink.drinkname || drink.othername}
                    onClick={() => {
                      const isMisc = !!drink.othername;
                      const item = isMisc
                        ? {
                            name: drink.othername,
                            price: drink.otherprice.toFixed(2),
                            size: "-",
                            ice: "-",
                            sweetness: "-",
                            toppings: "-",
                            quantity: "1"
                          }
                        : {
                            name: drink.drinkname,
                            price: drink.drinkprice.toFixed(2),
                            size: "",
                            ice: "",
                            sweetness: "",
                            toppings: "",
                            quantity: "1"
                          };
                      setorderDetails(prevDetails => [...prevDetails, item]);
                      setScreen(isMisc ? "cashier" : "cashier-customization");
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No drinks in this category for now. Check back later!</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order">
        <h1>Order Summary</h1>
        {orderDetails.length > 0 ? (
          <>
            {orderDetails.map((order, index) => (
              <div className="order-item" key={index}>
                <div className="order-left">
                  <functions.Button text="X"
                    onClick={() => {
                      functions.deleteItem(index, orderDetails, setorderDetails);
                      console.log("Delete button clicked for", order.name);
                    }}
                  />
                  <div className="quantity">
                    <button
                      onClick={() => {
                        const updated = [...orderDetails];
                        updated[index].quantity = Math.max(1, (parseInt(order.quantity) || 1) - 1);
                        setorderDetails(updated);
                      }}
                      style={{ backgroundColor: "#38bdf8" }}
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
                        const updated = [...orderDetails];
                        updated[index].quantity = newQty;
                        setorderDetails(updated);
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = [...orderDetails];
                        updated[index].quantity = (parseInt(order.quantity) || 1) + 1;
                        setorderDetails(updated);
                      }}
                      style={{ backgroundColor: "#38bdf8" }}
                    >
                      +
                    </button>
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
                  <functions.Button text="Edit"
                    onClick={() => {
                      functions.editItem(index, setCurrentEditIdx, setScreen);
                      console.log("Edit button clicked for", order.name);
                    }}
                  />
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
        <functions.Button text="Add More"
          onClick={() => {
            setScreen("cashier");
            functions.defaultVal(orderDetails, setorderDetails);
          }}
        />
        <functions.Button text="Checkout"
          onClick={() => {
            const totalItems = orderDetails.reduce((sum, order) => sum + parseInt(order.quantity || 1), 0);
            functions.checkout(totalItems, total.toFixed(2), orderDetails);
            functions.defaultVal(orderDetails, setorderDetails);
            setScreen("cashier");
            alert("Thanks for the order!\n\nOrder Total: $" + total.toFixed(2));
            setorderDetails([]);
          }}
        />
      </div>
    </>
  );
}

export default EmployeeDrinks;
