import { useState, useEffect } from "react";
import "./Employee.css";
import * as functions from "./functions.js";

function EmployeeToppingsScreen({ setScreen, selectedCategory, orderDetails, setorderDetails, currentEditIdx, setCurrentEditIdx }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toppings, setToppings] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getToppings("Toppings");
  }, []);

  const getToppings = async (category) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/${category}`);
      if (!response.ok) throw new Error("Failed to fetch drinks");
      const data = await response.json();
      const formatted = data.map(item => ({
        name: item.drinkname || item.othername,
        price: parseFloat(item.drinkprice || item.otherprice)
      }));
      setToppings(formatted);
    } catch (error) {
      console.error(error);
      setToppings([]);
    }
  };

  const toggleTopping = (name) => {
    setSelectedToppings(prev =>
      prev.includes(name)
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  };

  useEffect(() => {
    const idx = currentEditIdx != null ? currentEditIdx : orderDetails.length - 1;
    if (orderDetails[idx] && orderDetails[idx].toppings && orderDetails[idx].toppings !== "none") {
      const toppingsList = orderDetails[idx].toppings
        .split(", ")
        .map(t => t.split(" (+")[0]);
      setSelectedToppings(toppingsList);
    } else {
      setSelectedToppings([]);
    }
  }, [currentEditIdx, orderDetails]);

  const subtotal = orderDetails.reduce((subtotal, order) => {
    const price = parseFloat(order.price);
    const qty = parseInt(order.quantity);
    return !isNaN(price) ? subtotal + price * qty : subtotal;
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

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
        {/* spacer rows */}
        <tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr>
        <tr>
          {selectedCategory !== "Toppings" && (
            <functions.Button text="Back to Customization" onClick={() => setScreen("cashier-customization")} />
          )}
          <functions.Button text="Remove Current Item" onClick={() => {
            setorderDetails(orderDetails.slice(0, orderDetails.length - 1));
            setScreen("cashier");
            setCurrentEditIdx(null);
          }} />
        </tr><tr>
          <functions.Button text="Clear Order" onClick={() => {
            setorderDetails([]);
            setScreen("cashier");
            setCurrentEditIdx(null);
          }} />
        </tr><tr>
          <functions.Button text="Logout" onClick={() => setScreen("home")} />
        </tr></tbody></table>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="main">
          <h1>Toppings</h1>
          <div className="toppings-grid">
            {toppings.map(({ name, price }) => (
              <button
                key={name}
                className={`topping-button ${selectedToppings.includes(name) ? "selected" : ""}`}
                onClick={() => {
                  toggleTopping(name);
                  if (selectedCategory === "Toppings") {
                    setorderDetails(prevDetails => {
                      if (prevDetails.length > 0 && prevDetails[prevDetails.length - 1].name === "Topping Only") {
                        return prevDetails.map((order, index) => {
                          if (index === prevDetails.length - 1) {
                            return {
                              ...order,
                              name: name,
                              price: price.toFixed(2),
                              size: "n/a",
                              ice: "n/a",
                              sweetness: "n/a",
                              toppings: "n/a",
                              quantity: "1"
                            };
                          }
                          return order;
                        });
                      } else {
                        return [...prevDetails, {
                          name: name,
                          price: price.toFixed(2),
                          size: "n/a",
                          ice: "n/a",
                          sweetness: "n/a",
                          toppings: "n/a",
                          quantity: "1"
                        }];
                      }
                    });
                  } else {
                    setorderDetails(prevDetails => {
                      const idx = currentEditIdx != null ? currentEditIdx : prevDetails.length - 1;
                      return prevDetails.map((order, index) => {
                        if (index !== idx) return order;
                        const toppingText = `${name} (+$${price.toFixed(2)})`;
                        const hasTopping = order.toppings?.includes(name);
                        let newToppings = "";
                        let newPrice = parseFloat(order.price);
                        if (hasTopping) {
                          const toppingsArray = order.toppings.split(", ").filter(t => !t.includes(name));
                          newToppings = toppingsArray.length > 0 ? toppingsArray.join(", ") : "none";
                          newPrice -= price;
                        } else {
                          newToppings = order.toppings === "none" || !order.toppings
                            ? toppingText
                            : `${order.toppings}, ${toppingText}`;
                          newPrice += price;
                        }
                        return { ...order, toppings: newToppings, price: newPrice.toFixed(2) };
                      });
                    });
                  }
                }}
              >
                {name} (+${price.toFixed(2)})
              </button>
            ))}
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
                  <functions.Button text="X" onClick={() => functions.deleteItem(index, orderDetails, setorderDetails, setScreen)} />
                  <div className="quantity">
                    <button onClick={() => {
                      const updated = [...orderDetails];
                      updated[index].quantity = Math.max(1, (parseInt(order.quantity) || 1) - 1);
                      setorderDetails(updated);
                    }} style={{ backgroundColor: "#38bdf8" }}>–</button>
                    <input
                      type="number"
                      min="1"
                      className="quantity-input"
                      value={order.quantity}
                      onChange={(e) => {
                        const updated = [...orderDetails];
                        updated[index].quantity = parseInt(e.target.value) || 1;
                        setorderDetails(updated);
                      }}
                    />
                    <button onClick={() => {
                      const updated = [...orderDetails];
                      updated[index].quantity = (parseInt(order.quantity) || 1) + 1;
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
                  <functions.Button text="Edit" onClick={() => functions.editItem(index, setCurrentEditIdx, setScreen)} />
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
          setCurrentEditIdx(null);
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

export default EmployeeToppingsScreen;
