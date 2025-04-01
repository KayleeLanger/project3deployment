import { useState, useEffect } from "react";
import "./Employee.css"; 

function EmployeeCustomization({ setScreen, selectedCategory, OrderDetails, setorderDetails }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	
	//clock setup
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// needed variables for the backend (Felicia's tasks)
	const [size, setSize] = useState("");
	const [ice, setIce] = useState("");
	const [sweetness, setSweetness] = useState("");

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
			<h1>Customization<br></br></h1>
			<div className = "customization-options">
			{/* TODO: ADD CUSTOMIZATION FRONTEND! */}
			 <SizeSelector selectedSize={size} setSelectedSize={setSize} details={orderdetails} setDetails={setorderDetails}/>
			 <IceSelector selectedIce={ice} setSelectedIce={setIce} details={orderdetails} setDetails={setorderDetails} />
			 <SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} details={orderdetails} setDetails={setorderDetails} />

			 <button onClick={() => setScreen("cashier-toppings")}
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
	
	
	
			
		{/* Order Results */}
		<div className="order">
			<h1>Order Summary</h1>
			{/* loop through order items and display */}
				{orderdetails && orderdetails.length > 0 ? (
			orderdetails.map((orderdetails, index) => ( <>
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
			</>
			))) : (
			<p>No items</p>
			)}
			{/* display order totals */}
			<div className = "order-total">
				<h3>Subtotal: ${subtotal.toFixed(2)} </h3>
				<h3>Tax: ${tax.toFixed(2)} </h3>
				<h2>Total: ${total.toFixed(2)}</h2>
			</div>
	
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

// sidebar button used to do control buttons
function Button({ text, onClick }) {
	return <button onClick={onClick}>{text}</button>;
}

function customize(option, custom, details , setDetails) {
	details[details.length - 1] = {
		...details[details.length - 1],
		[option]: custom,
	};
	setDetails(details);
}

function SizeSelector({ selectedSize, setSelectedSize , details , setDetails }) {
	return (
	  <div className="option-row">
		<div className="option-label">Size</div>
		<div className="option-buttons">
		  <button
			className={selectedSize === "regular" ? "selected" : ""}
			onClick={() => {
				setSelectedSize("regular");
				customize("size", "regular", details, setDetails);
			}}
		  >
			Regular
		  </button>
		  <button
			className={selectedSize === "large" ? "selected" : ""}
			onClick={() => {
				setSelectedSize("large");
				customize("size", "large", details, setDetails);
			}}
		  >
			Large
		  </button>
		</div>
	  </div>
	);
}
  
  function IceSelector({ selectedIce, setSelectedIce , details , setDetails }) {
	return (
	  <div className="option-row">
		<div className="option-label">Ice</div>
		<div className="option-buttons">
		  <button
			className={selectedIce === "no" ? "selected" : ""}
			onClick={() => {
				setSelectedIce("no");
				customize("ice", "no" , details, setDetails);
			}}
		  >
			No
		  </button>
		  <button
			className={selectedIce === "less" ? "selected" : ""}
			onClick={() => {
				setSelectedIce("less");
				customize("ice", "less" , details, setDetails);
			}}
		  >
			Less
		  </button>
		  <button
			className={selectedIce === "regular" ? "selected" : ""}
			onClick={() => {
				setSelectedIce("regular");
				customize("ice", "regular" , details, setDetails);
			}}
		  >
			Regular
		  </button>
		</div>
	  </div>
	);
  }
  

function SweetnessSelector({selectedSweetness, setSelectedSweetness, details , setDetails}) {  
	const sweetnessOptions = ["0%", "25%", "50%", "75%", "100%"];

	return (
	  <div className="option-row">
		<div className="option-label">Sweetness</div>

		<div className="option-buttons">
		  {sweetnessOptions.map(option => (
			<button
			  key={option}
			  onClick={() => {
				setSelectedSweetness(option);
				customize("sweetness", option , details, setDetails);
			}}
			  className={selectedSweetness === option ? "selected" : ""}
			>
			  {option}
			</button>
		  ))}
		</div>
	  </div>
	);
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


export default EmployeeCustomization;
