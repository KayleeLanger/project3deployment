import { useState, useEffect } from "react";
import "./Employee.css"; 

function EmployeeCategoryScreen({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	// const [currentOrder, setState]=useState()

	/// BACKEND NEEDS TO UPDATE THIS(category list)
	const categories = [{name: "cat1"}, {name: "A very long Drink name "}, {name: "cat3"}, {name: "cat4"},{name: "cat1"}];

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
	  	<h1>Cashier Categories<br></br></h1>
		<div className = "mainBody">
		  {/* loop through Categories */}
		  {categories.map(category=> (
			<div class= "buttonBox">
			<CategoryButton
				 key={category.name} 
				 text={category.name} 
				 onClick={() => setScreen("cashier-drinks")} 
				 
				 ></CategoryButton> </div>
		  ))}
		 

		</div>
        
      </div>
	  </div>



	<div style={{ padding: "20px" }}>
  		<Button text="Go to Customization Page" onClick={() => setScreen("cashier-customization")} />
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

  



export default EmployeeCategoryScreen;
