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


    /// TODO:BACKEND NEEDS TO UPDATE THIS(drink list)
    //const drinks = [{name: "drink1", price: "5.00"}, {name: "drink2", price: "5.00"}, {name: "drink3", price: "5.00"}, {name: "drink4", price: "5.00"}];

	  // TODO: Update order details
    //const orderdetails= [{name: "Item1", price: "4.00", ice: "25%", sweetness:"100%", toppings:"boba"}, {name: "Item2", price: "2.00", ice: "50%", sweetness:"109%", toppings:"creama"}];
    let orderdetails = [];
    if (OrderDetails.length > 0) {
      orderdetails = OrderDetails;
    }



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
                      setorderDetails([{
                        name: drink.drinkname, 
                        price: drink.drinkprice, 
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
            orderdetails.map((orderdetails, index) => ( <>
            <div className="order-item">
        <div className="order-header">
            <h3>{orderdetails.name}</h3>
            <h3>${orderdetails.price}</h3>
        </div>
        <p>
            <strong>Ice:</strong> {orderdetails.ice} <br />
            <strong>Sweetness:</strong> {orderdetails.sweetness} <br />
            <strong>Toppings:</strong> {orderdetails.toppings}
        </p>
</div>
</>
           


        ))) : (
        <p>No items</p>
        )}
   


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






export default EmployeeDrinks;



