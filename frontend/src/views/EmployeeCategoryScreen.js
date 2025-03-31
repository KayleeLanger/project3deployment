import { useState, useEffect } from "react";
import "./Employee.css";


function EmployeeCategoryScreen({ setScreen, setSelectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [currentOrder, setState]=useState()


    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "Miscellaneous"}];


    // TODO: Update order details
    //const orderdetails= [{name: "Item1", price: "4.00", ice: "25%", sweetness:"100%", toppings:"boba"}, {name: "Item2", price: "2.00", ice: "50%", sweetness:"109%", toppings:"creama"}];
    let orderdetails = [];
    if (OrderDetails.length > 0) {
      orderdetails = OrderDetails;
    }

    const subtotal = orderdetails.reduce((subtotal, order) => {
      const price = parseFloat(order.price);
      return !isNaN(price) ? subtotal + price: subtotal;
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
            <Button text="Clear Order" onClick={() => {
              setScreen("cashier");
              setorderDetails([]);
            }} />
        </tr><tr>
          <Button text="Logout" onClick={() => setScreen("home")} />
        </tr></table>
      </div>










      {/* Main content */}
      <div className="container">
      <div className="main">
        <h1>Cashier Categories<br></br></h1>
        <div className = "mainBody">
          {/* loop through Categories */}
          {categories.map(category=> (
            <div class= "buttonBox">
            <CategoryButton
                 key={category.name}
                 text={category.name}
                 onClick={() =>  {
                    setSelectedCategory(category.name); //update cat and switch page
                    setScreen("cashier-drinks");
                  }}
                 
                 ></CategoryButton> </div>
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
            {orderdetails.map((orderdetails, index) => (
              <div className="order-item">
                <div className="order-header">
                    <h3>{orderdetails.name}</h3>
                    <h3>${orderdetails.price}</h3>
                </div>
                <p>
                    <strong>Size:</strong> {orderdetails.size} <br />
                    <strong>Ice:</strong> {orderdetails.ice} <br />
                    <strong>Sweetness:</strong> {orderdetails.sweetness} <br />
                    <strong>Toppings:</strong> {orderdetails.toppings}
                </p>
              </div>
            ))}
            {/* display order totals */}
            <div className = "order-total">
              <h3>Subtotal: ${subtotal.toFixed(2)} </h3>
              <h3>Tax: ${tax.toFixed(2)} </h3>
              <h2>Total: ${total.toFixed(2)}</h2>
            </div>
          </>
        ) : (
          <p>Add a Drink To Get Started!</p>
        )}
  

        <Button text="Add More" 
          onClick={() => {
            setScreen("cashier"); 
          }} />
        <Button text="Checkout" 
          onClick={() => {
            checkout(orderdetails.length , total.toFixed(2));
            setScreen("cashier"); 
            alert("Thanks for the order!\n\nOrder Total: $" + total.toFixed(2));
            setorderDetails([]);
          }} />
      </div>
    </>
  );
}


function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function CategoryButton({ text, onClick }) {
    return <button
    style={{
        backgroundColor: "rgb(19, 90, 120)",
        color: "white" ,
        width: "200px",
        height: "200px",
        margin: "20px",
        padding: "20px"
        }}
        onClick={onClick}>{text}</button>;
}

function checkout (numItems, orderTotal) {
  const executeCheckout = async () => {
    try {
      const orderDate = getCurrentDateTime();
      console.log(orderDate);
      const employeeId = '123460';                // NEED TO FILL WITH PROPER ID
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numItems,
          orderTotal,
          orderDate,
          employeeId,
        }),
      });
      if (!response.ok) throw new Error ("Failed to place order");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  executeCheckout();
}

function getCurrentDateTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default EmployeeCategoryScreen;


