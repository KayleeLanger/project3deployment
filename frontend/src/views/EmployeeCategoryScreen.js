import { useState, useEffect } from "react";
import "./Employee.css";


function EmployeeCategoryScreen({ setScreen, setSelectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [currentOrder, setState]=useState()


    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "MISC."}];


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
        <p>Add a Drink To Get Started!</p>
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


