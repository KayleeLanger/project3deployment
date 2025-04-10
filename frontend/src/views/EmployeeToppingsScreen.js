import { useState, useEffect } from "react";
import "./Employee.css";
import * as functions from "./functions.js";

function EmployeeToppingsScreen({ setScreen , selectedCategory, OrderDetails, setorderDetails, currentEditIdx, setCurrentEditIdx }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toppings, setToppings] = useState([]);
    
  //clock setup
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // get drinks for category
  useEffect(() => {
    getToppings("Toppings");
  }, []);

  const getToppings = async (category ) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/${category}`);
      if (!response.ok) throw new Error ("Failed to fetch drinks");
      const data = await response.json();
      console.log("data: ", data);

      const formatted = data.map(item => ({
        name: item.drinkname || item.othername,
        price: parseFloat(item.drinkprice || item.otherprice)
      }))
      setToppings(formatted); // set toppings state with data
    } catch (error) {
      console.error(error);
      setToppings([]);  // reset toppings if error
    }
  };

  const toggleTopping = (name) => {
    setSelectedToppings(prev =>
      prev.includes(name)
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  };

  let orderdetails = [];
  if (OrderDetails.length > 0) {
    orderdetails = OrderDetails;
  }

  useEffect(() => {
    const idx = currentEditIdx != null ? currentEditIdx : orderdetails.length - 1;
    if (
      orderdetails[idx] &&
      orderdetails[idx].toppings &&
      orderdetails[idx].toppings !== "none"
    ) {
      const toppingsList = orderdetails[idx].toppings
        .split(", ")
        .map(t => t.split(" (+")[0]); // Strip out the " (+$...)" part
      setSelectedToppings(toppingsList);
    } else {
      setSelectedToppings([]);
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
        {selectedCategory !== "Toppings" && (
          <functions.Button text="Back to Customization" onClick={() => setScreen("cashier-customization")} />
        )}

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
                      // check if last item is "Topping Only"
                      if (prevDetails.length > 0 && prevDetails[prevDetails.length - 1].name === "Topping Only") {
                        // if last item is "Topping Only", overwrite it
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
                        // if not, add new item (already in topping only)
                        return [
                          ...prevDetails,
                          {
                            name: name,
                            price: price.toFixed(2),
                            size: "n/a",
                            ice: "n/a",
                            sweetness: "n/a",
                            toppings: "n/a",
                            quantity: "1"
                          }
                        ];
                      }
                    });
                  } else { // add toppings to drink
                    setorderDetails(prevDetails => {
                      const idx = currentEditIdx != null ? currentEditIdx : prevDetails.length - 1;
                
                      return prevDetails.map((order, index) => {
                        if (index !== idx) return order;
                
                        const toppingText = `${name} (+$${price.toFixed(2)})`;
                        const hasTopping = order.toppings?.includes(name);
                
                        let newToppings = "";
                        let newPrice = parseFloat(order.price);
                
                        if (hasTopping) {
                          // remove topping
                          const toppingsArray = order.toppings
                            .split(", ")
                            .filter(t => !t.includes(name));
                          newToppings = toppingsArray.length > 0 ? toppingsArray.join(", ") : "none";
                          newPrice -= price;
                        } else {
                          // add topping
                          newToppings =
                            order.toppings === "none" || !order.toppings
                              ? toppingText
                              : `${order.toppings}, ${toppingText}`;
                          newPrice += price;
                        }
                        return {
                          ...order,
                          toppings: newToppings,
                          price: newPrice.toFixed(2),
                        };
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

      {/* Order Results */}
      <div className="order">
        <h1>Order Summary</h1>
        {/* loop through order items and display */}
        {orderdetails && orderdetails.length > 0 ? ( 
          <>
            {orderdetails.map((order, index) => (
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
            ))}
            {/* display order totals */}
            <div className = "order-total" style={{ textAlign: "right" }}>
              <h3>Subtotal: ${subtotal.toFixed(2)} </h3>
              <h3>Tax: ${tax.toFixed(2)} </h3>
              <h2>Total: ${total.toFixed(2)}</h2>
            </div>
          </>
        ) : (
          <p>Add a Drink To Get Started!</p>
        )}
        
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

export default EmployeeToppingsScreen;