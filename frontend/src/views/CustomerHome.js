import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png"; 
import * as functions from "./functions.js";


function CustomerHome({ setScreen, setSelectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [currentOrder, setState]=useState()


    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "Miscellaneous"}];



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
            {/* TIME BOX TODO: ADD WEATHER Sprint 3 */}
            <div className="time-box">
                <h2>{currentTime.toLocaleTimeString()}</h2>
                <strong>{currentTime.toLocaleDateString()}</strong>
            </div>

            {/* DRINK CATEGORIES */}
            {categories.map(category => (
                <functions.SideButton
                key={category.name}
                text={category.name}
                onClick={() => {
                setSelectedCategory(category.name);
                setScreen("customer-drinks");
            }}
            />
            ))}

            {/* ONLY TOPPINGS BUTTON (goes to a different screen ) */}
            <functions.SideButton
                text="Individual Toppings"
                 onClick={() => setScreen("customer-toppings")}
            />

            {/* BLANK BUTTON THAT TAKES YOU BACK HOME */}
            <functions.SideButton
                onClick={() => setScreen("home")}
            />
        </div>
      



      {/* Main content */}
      
      <div className="homeScreen">
        <img src={logo} alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
        <h1>Welcome!<br></br></h1>
        <h3>Please click on the category on the left to get started with your order!</h3>
        
       
      </div>
      
    </>
  );
}


// function Button({ text, onClick }) {
//   return <button onClick={onClick}>{text}</button>;
// }




export default CustomerHome;


