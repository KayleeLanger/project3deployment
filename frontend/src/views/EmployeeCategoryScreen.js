import { useState, useEffect } from "react";
import "./Employee.css";
import * as functions from "./functions.js";


function EmployeeCategoryScreen({ setScreen, setSelectedCategory, OrderDetails, setorderDetails, setCurrentEditIdx}) {
    const [currentTime, setCurrentTime] = useState(new Date());


    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "Toppings"}, {name: "Miscellaneous"}];


    // TODO: Update order details
    let orderdetails = [];
    if (OrderDetails.length > 0) {
      orderdetails = OrderDetails;
    }

    const subtotal = orderdetails.reduce((subtotal, order) => {
      const price = parseFloat(order.price);
      const qty = parseInt(order.quantity);
      return !isNaN(price) ? subtotal + price * qty: subtotal;
    }, 0);
  
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    //clock setup
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
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
            {/* Clear order and start over */}
            <functions.Button text="Clear Order" onClick={() => {
              setScreen("cashier");
              setorderDetails([]);
            }} />
        </tr><tr>
          <functions.Button text="Logout" onClick={() => setScreen("home")} />
        </tr></table>
      </div>










      {/* Main content */}
      <div className="container">
      <div className="main">
        <h1>Cashier Categories<br></br></h1>
        <div className = "mainBody">
          {/* loop through Categories */}
          {categories.map(category=> (
            <div className= "buttonBox">
            <functions.CategoryButton
                  key={category.name}
                  text={category.name}
                  onClick={() =>  {
                    setSelectedCategory(category.name); //update cat and switch page
                    if (category.name === "Toppings") {
                      setScreen("cashier-toppings");
                      setorderDetails(prevDetails => [ // add in place holder for topping only
                        ...prevDetails,
                        {
                          name: "Topping Only", 
                          price: "", 
                          size: "n/a",
                          ice: "n/a",
                          sweetness: "n/a",
                          toppings: "n/a",
                          quantity: "1"
                        }]);
                    } else {
                      setScreen("cashier-drinks");
                    }
                  }}
                
                ></functions.CategoryButton> </div>
          ))}
      </div>
    </div>
    </div>








      {/* Order Results */}
      <div className="order">
        <h1>Order Summary</h1>
        {/* loop through order items and display */}
        {/* check if items in order is greater than zero, if so then add items.  */}
        {orderdetails && orderdetails.length > 0 ? ( 
          <>
            {orderdetails.map((order, index) => (
              <div className="order-item">
                <div className = "order-left">
                  {/* Delete button */}
                  <functions.Button text="X" 
                    onClick={() => {
                      functions.deleteItem(index, orderdetails, setorderDetails);
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
                      style={{ backgroundColor: "#38bdf8"}}
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
                      style={{ backgroundColor: "#38bdf8"}}
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

export default EmployeeCategoryScreen;