import { useState, useEffect } from "react";
import "./Customer.css";
import * as functions from "./functions.js";
import LargeTextButtons from "./LargeTextButton.js";


function CustomerDrinks({ setScreen, setSelectedCategory, selectedCategory, OrderDetails, setorderDetails, setToppingMode }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [drinks, setDrinks] = useState([]);

    //fetch drinks based on selected category
    useEffect(() => {
        if (selectedCategory) {
            getDrinks(selectedCategory);
        }
    }, [selectedCategory]);

    const getDrinks = async (category) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks/category/${category}`);
            if (!response.ok) throw new Error("Failed to fetch drinks");
            const data = await response.json();
            console.log("data: ", data);
            setDrinks(data);
        } catch (error) {
            console.error(error);
            setDrinks([]);
        }
    };

    //category list
    const categories = [
        { name: "Milk Tea" }, { name: "Brewed Tea" }, { name: "Ice Blended" },
        { name: "Fresh Milk" }, { name: "Fruit Tea" }, { name: "Tea Mojito" },
        { name: "Seasonal" }, { name: "Miscellaneous" }
    ];

    //clock setup
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/*Sidebar*/}
            <div className="sidebar">
                <div className="time-box">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <strong>{currentTime.toLocaleDateString()}</strong>
                </div>
                <functions.WeatherEntry/>

                {categories.map((category) =>
                    category.name === selectedCategory ? (
                        <functions.SpecialSideButton
                            key={category.name}
                            text={category.name}
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setScreen("customer-drinks");
                            }}
                        />
                    ) : (
                        <functions.SideButton
                            key={category.name}
                            text={category.name}
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setScreen("customer-drinks");
                            }}
                        />
                    )
                )}

                <functions.SideButton
                    text="Individual Toppings"
                    onClick={() => {
                        setSelectedCategory("toppings");
                        setToppingMode("standalone");
                        setScreen("customer-toppings");
                    }}
                />

                {/*Checkout*/}
                <functions.SideButton
                    text="Checkout"
                    onClick={() => {
                        if (OrderDetails.length > 0) {
                            setScreen("confirm");
                        } else {
                            alert("No items in the order!");
                        }
                    }}
                />

                {/* BUTTON THAT TAKES YOU BACK HOME */}
                <functions.SideButton
                    text="Home"
                    onClick={() => setScreen("home")}
                />
            </div>

            {/*Main content*/}
            <div className="homeScreen">
                <functions.XButton text="X" onClick={() => setScreen("customer")} />
                <h1>{selectedCategory}</h1>
                <div className="mainBody">
                <LargeTextButtons/>
                    {drinks.length > 0 ? (
                        drinks.map(drink => (
                            <div className="buttonBox" key={drink.drinkname}>
                                <functions.CustomerDrinkButton
                                    text = {drink.drinkname || drink.othername} 
                                    image={
                                        drink.othername
                                            ? functions.getMiscImage(drink.othername)  //if misc item
                                            : functions.getDrinkImage(drink.drinkname)  //if normal drink
                                    }
                                    onClick={() => {
                                        const isMisc = !!drink.othername;
                                        const item = isMisc
                                            ? {
                                                name: drink.othername,
                                                price: drink.otherprice.toFixed(2),
                                                size: "-",
                                                ice: "-",
                                                sweetness: "-",
                                                toppings: "-",
                                                quantity: "1",
                                                otherId: drink.otherid
                                            }
                                            : {
                                                name: drink.drinkname,
                                                price: drink.drinkprice.toFixed(2),
                                                size: "",
                                                ice: "",
                                                sweetness: "",
                                                toppings: "",
                                                quantity: "1",
                                                drinkId: drink.drinkid
                                            };
                                    
                                        setorderDetails(prevDetails => [...prevDetails, item]);
                                        setScreen(isMisc ? "confirm" : "customer-customization");
                                    }}
                                              
                                />
                            </div>
                        ))
                    ) : (
                        <p>No drinks in this category for now. Check back later!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CustomerDrinks;
