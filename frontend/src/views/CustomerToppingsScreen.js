import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png"; 
import * as functions from "./functions.js";


function CustomerToppingsScreen({ setScreen, setSelectedCategory, selectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [toppings, setToppings] = useState([]);

    //const [currentOrder, setState]=useState([]);

    // // get drinks for category
    // useEffect(() => {
    //   if (selectedCategory) {
    //     getDrinks(selectedCategory);
    //   }
    // }, [selectedCategory]); // rerun function when category changes

    // const getToppings = async ( ) => {

    // };



    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "Miscellaneous"}];


    // need a useEffect here to fetch toppings when component mounts
    useEffect(() => {
        const getToppings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/toppings`);
                if (!response.ok) throw new Error("Failed to fetch toppings");
                const data = await response.json();
                console.log("Raw data from /api/toppings:", data);

                // Filter out for just toppings, since our database is toppings_other with some misc items
                const filteredToppings = data.filter(item => item.othertype === "topping");
                console.log("Filtered toppings:", filteredToppings);
                setToppings(filteredToppings);
            }   catch (error) {
                console.error(error);
                setToppings([]);
            }
        };
        getToppings();
        }, []);
    
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

            {/* DRINK CATEGORIES if selected darker (SideButton vs SpecialSideButton(special one)*/}
            {categories.map((category) =>
              
                <functions.SideButton
                    key={category.name}
                    text={category.name}
                    onClick={() => {
                        setScreen("customer-drinks");
                    }}
                />
            )}

            {/* ONLY TOPPINGS BUTTON (goes to a different screen ) */}
            <functions.SpecialSideButton
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
        <functions.XButton text="X" onClick={() => setScreen("customer")} />
        <h1>Single Topping</h1>
        <div className = "mainBody">
            {/* loop through toppings */}
            {toppings.length > 0 ? (
                toppings.map( (topping) => (
                    <div className ="buttonBox" key={topping.othername}>
                        <functions.CustomerDrinkButton
                            text = {topping.othername}
                            image={logo} // TODO: LONG UPDATE IMAGES!!
                            onClick={() => {
                              setorderDetails(prevDetails => [
                                ...prevDetails,
                                {
                                  name: topping.othername, 
                                  price: topping.otherprice?.toFixed(2) || "0.00",
                                  quantity: "1"
                                },
                            ]);
                              console.log(`Topping ${topping.othername} added to order`);
                            }}
                          />
                        </div>
                    ))
                    ) : (
                      <p> No toppings available. Please check back later!</p>
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




export default CustomerToppingsScreen;


