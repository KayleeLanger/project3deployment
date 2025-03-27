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
			<div className = "mainBody">
			 {/* TODO: ADD CUSTOMIZATION FRONTEND! */}
			 
	
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




export default EmployeeCustomization;
