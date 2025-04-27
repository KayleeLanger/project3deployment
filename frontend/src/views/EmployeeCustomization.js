import { useState, useEffect } from "react";
import "./Employee.css"; 
import * as functions from "./functions.js";

function EmployeeCustomization({ setScreen, selectedCategory, orderDetails, setorderDetails, currentEditIdx, setCurrentEditIdx }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [size, setSize] = useState("");
  const [ice, setIce] = useState("");
  const [sweetness, setSweetness] = useState("");

  // Setup clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize customization selections
  useEffect(() => {
    const idx = currentEditIdx != null ? currentEditIdx : orderDetails.length - 1;
    if (orderDetails[idx]) {
      const item = orderDetails[idx];
      setSize(item.size || "");
      setIce(item.ice || "");
      setSweetness(item.sweetness || "");
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
        {/* spacing rows */}
        <tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr><tr><h1> </h1></tr>
        <tr>
          <functions.Button text="Remove Current Item" onClick={() => {
            setorderDetails(orderDetails.slice(0, orderDetails.length - 1));
            setScreen("cashier");
            setCurrentEditIdx(null);
          }} />
        </tr><tr>
          <functions.Button text="Clear Order" onClick={() => {
            setScreen("cashier");
            setorderDetails([]);
            setCurrentEditIdx(null);
          }} />
        </tr><tr>
          <functions.Button text="Logout" onClick={() => setScreen("home")} />
        </tr></tbody></table>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="main">
          <h1>Customization</h1>
          <div className="customization-options">
            <functions.SizeSelector selectedSize={size} setSelectedSize={setSize} details={orderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>
            <functions.IceSelector selectedIce={ice} setSelectedIce={setIce} details={orderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>
            <functions.SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} details={orderDetails} setDetails={setorderDetails} currentEditIdx={currentEditIdx}/>

            <button
              onClick={() => {
                const updated = [...orderDetails];
                const idx = currentEditIdx != null ? currentEditIdx : orderDetails.length - 1;
                updated[idx] = {
                  ...updated[idx],
                  size,
                  ice,
                  sweetness
                };
                setorderDetails(updated);
                functions.defaultVal(updated, setorderDetails);
                setScreen("cashier-toppings");
              }}
              style={{
                padding: "10px 20px",
                borderRadius: "15px",
                backgroundColor: "#38bdf8",
                color: "white",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                width: "fit-content",
                marginTop: "10px"
              }}
            >
              Select Toppings
            </button>
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
                      functions.deleteItem(index, orderDetails, setorderDetails, setScreen);
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
          <p>No items</p>
        )}

        <functions.Button text="Add More"
          onClick={() => {
            setScreen("cashier");
            functions.defaultVal(orderDetails, setorderDetails);
            setCurrentEditIdx(null);
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

export default EmployeeCustomization;
