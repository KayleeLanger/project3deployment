import { useState, useEffect } from "react";
import "./Employee.css"; 

function EmployeeCustomization({ setScreen }) {
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
				{/* still need cancel order function */}
			<Button text="Cancel Order" onClick={() => setScreen("cashier")} />
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
			 <SizeSelector selectedSize={size} setSelectedSize={setSize} />
			 <IceSelector selectedIce={ice} setSelectedIce={setIce} />
			 <SweetnessSelector selectedSweetness={sweetness} setSelectedSweetness={setSweetness} />

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
	
			<Button text="Checkout" 
			onClick={() => {
				setScreen("home"); 
				alert("Thanks for the order!");
			}} />
	
	
		  </div>
		</>
	  );
}

// sidebar button used to do control buttons
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}



function SizeSelector({ selectedSize, setSelectedSize }) {
	return (
	  <div className="option-row">
		<div className="option-label">Size</div>
		<div className="option-buttons">
		  <button
			className={selectedSize === "regular" ? "selected" : ""}
			onClick={() => setSelectedSize("regular")}
		  >
			Regular
		  </button>
		  <button
			className={selectedSize === "large" ? "selected" : ""}
			onClick={() => setSelectedSize("large")}
		  >
			Large
		  </button>
		</div>
	  </div>
	);
  }
  
  function IceSelector({ selectedIce, setSelectedIce }) {
	return (
	  <div className="option-row">
		<div className="option-label">Ice</div>
		<div className="option-buttons">
		  <button
			className={selectedIce === "no" ? "selected" : ""}
			onClick={() => setSelectedIce("no")}
		  >
			No
		  </button>
		  <button
			className={selectedIce === "less" ? "selected" : ""}
			onClick={() => setSelectedIce("less")}
		  >
			Less
		  </button>
		  <button
			className={selectedIce === "regular" ? "selected" : ""}
			onClick={() => setSelectedIce("regular")}
		  >
			Regular
		  </button>
		</div>
	  </div>
	);
  }
  

function SweetnessSelector() {
	const [selectedSweetness, setSelectedSweetness] = useState("");
  
	const sweetnessOptions = ["0%", "25%", "50%", "75%", "100%"];
  
	return (
	  <div className="option-row">
		<div className="option-label">Sweetness</div>
  
		<div className="option-buttons">
		  {sweetnessOptions.map(option => (
			<button
			  key={option}
			  onClick={() => setSelectedSweetness(option)}
			  className={selectedSweetness === option ? "selected" : ""}
			>
			  {option}
			</button>
		  ))}
		</div>
	  </div>
	);
  }
  
  




export default EmployeeCustomization;
