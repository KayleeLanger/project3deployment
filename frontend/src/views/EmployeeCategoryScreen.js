import { useState, useEffect } from "react";
import "./Employee.css"; // Import the CSS file

function EmployeeCategoryScreen({ setScreen }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	// const [currentOrder, setState]=useState()

	/// BACKEND NEEDS TO UPDATE THIS(category list)
	const categories = [{name: "cat1"}, {name: "cat2"}, {name: "cat3"}, {name: "cat4"}];

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

      <div className="main">
	  	<h1>Cashier Categories<br></br></h1>

		  {/* loop through Categories */}
		  {categories.map(categories=> (
			<Button>text={categories.name} onClick={() => setScreen("cashier-drinks")}</Button>
		  ))}
        
      </div>




	  {/* Order Results */}
	  <div className="order">
        <h1>Order Summary</h1>
		{/* loop through order items and display */}


      </div>
    </>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}



export default EmployeeCategoryScreen;
