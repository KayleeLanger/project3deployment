import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png"; 
import * as functions from "./functions.js";


function CustomerDrinks({ setScreen, setSelectedCategory, selectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [currentOrder, setState]=useState()
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

            {/* DRINK CATEGORIES if selected darker (SideButton1 vs SideButton2(special one)*/}
            {categories.map((category) =>
              category.name === selectedCategory.name ? (
                <functions.SideButton
                key={category.name}
                text={category.name}
                onClick={() => {
                setSelectedCategory(category.name);
                setScreen("customer-drinks");
              }}/>
            ) : (
                <functions.SideButton2
                  key={category.name}
                  text={category.name}
                  onClick={() => {
                  setSelectedCategory(category.name);
                  setScreen("customer-drinks");
              }}/>)
            )}

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
        {/* <div className="container-drink"> */}
                {/* <div className="main"> */}
                  <functions.XButton text="X" onClick={() => setScreen("customer")} />
                  <h1>{selectedCategory}</h1>
                  <div className = "mainBody">
                    {/* loop through Categories */}
                    {drinks.length > 0 ? (
                      drinks.map(drink => (
                        <div className ="buttonBox" key={drink.name}>
                          <functions.CustomerDrinkButton
                            text = {drink.drinkname}
                            image={logo} // TODO: LONG UPDATE IMAGES!!
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
                              setScreen("customer-customization");
                            }}
                          ></functions.CustomerDrinkButton> 
                        </div>
                    ))
                    ) : (
                      <p> No drinks in this category for now. Check back later!</p>
                    )}
                  </div>
                {/* </div> */}
              {/* </div> */}
       
      </div>
      
    </>
  );
}


// function Button({ text, onClick }) {
//   return <button onClick={onClick}>{text}</button>;
// }




export default CustomerDrinks;


