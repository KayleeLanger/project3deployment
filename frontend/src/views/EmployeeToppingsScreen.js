import { useState, useEffect } from "react";
import "./Employee.css";

function EmployeeToppingsScreen({ setScreen , setSelectedCategory, OrderDetails, setorderDetails }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  //const [toppings, setToppings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
    
    //clock setup
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

  // Hardcoded toppings for now — backend will replace this later
  const toppings = [
    { name: "Pearl", price: 0.50 },
    { name: "Mini Pearl", price: 0.50 },
    { name: "Ice Cream", price: 0.75 },
    { name: "Pudding", price: 0.50 },
    { name: "Aloe Vera", price: 0.60 },
    { name: "Red Bean", price: 0.55 },
    { name: "Herb Jelly", price: 0.50 },
    { name: "Alyu Jelly", price: 0.50 },
    { name: "Lychee Jelly", price: 0.50 },
    { name: "Creama", price: 0.60 }
  ];

  // const getToppings = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/toppings/`);
  //     if (!response.ok) throw new Error ("Failed to fetch toppings");
  //     const data = await response.json();
  //     const formattedToppings = data.map(topping => ({
  //       name: topping.otherName,
  //       price: parseFloat(topping.otherPrice),
  //     }));
  //     console.log("Toppings data: ", formattedToppings);
  //     setToppings(formattedToppings); // set toppings state with data
  //   } catch (error) {
  //     console.error(error);
  //     setToppings([]);  // reset toppings if error
  //   }
  // };

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

  const subtotal = orderdetails.reduce((subtotal, order) => {
    const price = parseFloat(order.price);
    return !isNaN(price) ? subtotal + price: subtotal;
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
        <Button text="Back to Customization" onClick={() => setScreen("cashier-customization")} />
				<Button text="Remove Current Item" onClick={() => {
					setorderDetails(orderdetails.slice(0, orderdetails.length-1));
					setScreen("cashier");
				}} />
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
          <h1>Toppings</h1>
          <div className="toppings-grid">
            {toppings.map(({ name, price }) => (
              <button
                key={name}
                className={`topping-button ${selectedToppings.includes(name) ? "selected" : ""}`}
                onClick={() => {
                  toggleTopping(name);
                  setorderDetails(prevDetails => {
                    return prevDetails.map((order) => {
                      const newToppings = order.toppings ? `${order.toppings}, ${name} (+$${price.toFixed(2)})` : `${name} (+$${price.toFixed(2)})`;
                      const newPrice = parseFloat(order.price) + price;
                      return {
                        ...order,
                        price: newPrice.toFixed(2),
                        toppings: newToppings,
                      };
                    });
                  });
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

export default EmployeeToppingsScreen;
