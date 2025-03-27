import { useState, useEffect } from "react";
import "./Employee.css"; 

function EmployeeDrinks({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	// const [currentOrder, setState]=useState()

	/// BACKEND NEEDS TO UPDATE THIS(drink list)
	const drinks = [{name: "drink1", price: "5.00"}, {name: "drink2", price: "5.00"}, {name: "drink3", price: "5.00"}, {name: "drink4", price: "5.00"}];

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
	    <Button text="Cancel Order" onClick={() => setScreen("home")} />
		</tr><tr>
        <Button text="Logout" onClick={() => setScreen("home")} />
		</tr></table>
      </div>





      {/* Main content */}
	  <div className="container">
      <div className="main">
	  	<h1>Cashier Drinks<br></br></h1>
		<div className = "mainBody">
		  {/* loop through Categories */}
		  {drinks.map(drink=> (
			<div class= "buttonBox">
			<DrinkButton
				 key={drink.name} 
				 text={drink.name} 
				 onClick={() => setScreen("cashier-drinks")} 
				 
				 ></DrinkButton> </div>
		  ))}
		 

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

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
function DrinkButton({ text, onClick }) {
	return <button 
	style={{ 
		backgroundColor: "rgb(19, 90, 120)", 
		color: "white" ,
		width: "150px", 
		height: "50px",
		}} 
	    onClick={onClick}>{text}</button>;
  }



export default EmployeeDrinks;
