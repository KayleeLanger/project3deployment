import { useState, useEffect } from "react";
import "./Employee.css";


function EmployeeDrinks({ setScreen, selectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [drinks, setDrinks] = useState([]);

    //const [currentOrder, setState]=useState([]);

    // get drinks for category
    useEffect(() => {
      if (selectedCategory) {
        getDrinks(selectedCategory);
      }
    }, [selectedCategory]); // rerun function when category changes

    const getDrinks = async (category) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/${category}`);
        if (!response.ok) throw new Error ("Failed to fetch drinks");
        const data = await response.json();
        console.log("data: ", data);
        setDrinks(data); // set drinks state with data
      } catch (error) {
        console.error(error);
        setDrinks([]);  // reset drinks if error
      }
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
            <Button text="Remove Current Item" onClick={() => setScreen("cashier")} />
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
      <div className="container-drink">
        <div className="main">
          <XButton text="X" onClick={() => setScreen("cashier")} />
          <h1>{selectedCategory}</h1>
          <div className = "mainBody">
            {/* loop through Categories */}
            {drinks.length > 0 ? (
              drinks.map(drink => (
                <div className ="buttonBox" key={drink.name}>
                  <DrinkButton
                    text = {drink.drinkname}
                    onClick={() => {
                      setorderDetails(prevDetails => [
                        ...prevDetails,
                        {
                          name: drink.drinkname, 
                          price: drink.drinkprice.toFixed(2), 
                          size: "",
                          ice: "",
                          sweetness: "",
                          toppings: ""
                      }]);
                      setScreen("cashier-customization");
                    }}
                  ></DrinkButton> 
                </div>
            ))
            ) : (
              <p> No drinks in this category for now. Check back later!</p>
            )}
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
                {orderdetails.ice !== "n/a" && (
                  <p>
                    <strong>Size:</strong> {orderdetails.size} <br />
                    <strong>Ice:</strong> {orderdetails.ice} <br />
                    <strong>Sweetness:</strong> {orderdetails.sweetness} <br />
                    <strong>Toppings:</strong> {orderdetails.toppings}
                  </p>
                )}
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
          defaultVal(orderdetails, setorderDetails);
				}} />
			<Button text="Checkout" 
        onClick={() => {
          checkout(orderdetails.length , total.toFixed(2));
          defaultVal(orderdetails, setorderDetails);
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
function XButton({ text, onClick }) {
    return <button
    style={{
        backgroundColor: "rgb(120, 19, 19)",
        color: "white",
        borderRadius: "50px",
        }} onClick={onClick}>{text}</button>;
  }
function DrinkButton({ text, onClick }) {
    return <button
    style={{
        backgroundColor: "rgb(120, 19, 78)",
        color: "white" ,
        width: "200px",
        height: "200px",
        margin: "20px",
        padding: "20px"
        }}
        onClick={onClick}>{text}</button>;
}

function defaultVal (orders, setOrders) {
	// copy of orderdetails
	const updatedOrderDetails = [...orders];
	
	// last item in order
	const lastOrder = updatedOrderDetails[updatedOrderDetails.length - 1];
	
	if (lastOrder.size === "") {
		lastOrder.size = "regular";
	}
	if (lastOrder.ice === "") {
		lastOrder.ice = "regular";
	}
	if (lastOrder.sweetness === "") {
		lastOrder.sweetness = "100%";
	}
	if (lastOrder.toppings === "") {
		lastOrder.toppings = "none";
	}

	setOrders(updatedOrderDetails);
}

function checkout (numItems, orderTotal) {
  const executeCheckout = async () => {
    try {
      const orderDate = getCurrentDateTime();
      console.log(orderDate);
      const employeeId = '123460';
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

export default EmployeeDrinks;