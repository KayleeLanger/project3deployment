import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png"; 
import * as functions from "./functions.js";
import LargeTextButtons from "./LargeTextButton.js";


function CustomerHome({ setScreen, setSelectedCategory, OrderDetails, setorderDetails }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [currentOrder, setState]=useState()

    // /// category list: hardcoded since categories won't change, only drinks
    // const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Crema"}, {name: "Seasonal"}, {name: "Miscellaneous"}];
    /// category list: hardcoded since categories won't change, only drinks
    const categories = [{name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"}, {name: "Fresh Milk"},{name: "Fruit Tea"}, {name: "Tea Mojito"}, {name: "Seasonal"}, {name: "Miscellaneous"}];


    //clock setup
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const [translateKey] = useState(() => Date.now());

    // machine translation API
    useEffect(() => {

        // translate div style
        const newDiv = document.createElement("div");
        newDiv.id = "google_translate_element";
        document.body.appendChild(newDiv);
    
        // initialize translate widget
        const initTranslateWidget = () => {
            const checkExist = setInterval(() => {
                if (
                    window.google &&
                    window.google.translate &&
                    typeof window.google.translate.TranslateElement === "function"
                ) {
                    clearInterval(checkExist);
                    new window.google.translate.TranslateElement(
                        { pageLanguage: "en" },
                        "google_translate_element"
                    );
                }
            }, 100);
        };
    
        // load script only once
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
    
            // google calls this global when script loads
            window.googleTranslateElementInit = initTranslateWidget;
        } else {
            // if script already loaded, call init directly
            initTranslateWidget();
        }
    }, []);


    return (
    <>
       
        {/* Sidebar (logout, time, cancel order)*/}
        <div className="sidebar">

            {/* TIME BOX */}
            <div className="time-box">
                <h2>{currentTime.toLocaleTimeString()}</h2>
                <strong>{currentTime.toLocaleDateString()}</strong>
            </div>
            <functions.WeatherEntry/>

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
            

            {/* BLANK BUTTON THAT TAKES YOU BACK HOME */}
            <functions.SideButton
                onClick={() => setScreen("home")}
            />
        </div>
    

        {/* Main content */}
        {/* Welcome if no items in order, else encouragement to add more */}
        {(OrderDetails.length === 0 ? (
            <div className="homeScreen">
                <LargeTextButtons/>
                <img src={logo} alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
                <h1>Welcome!<br></br></h1>
                <h3>Please click on the category on the left to get started with your order!</h3>
            </div>
        ) : (
            <div className="homeScreen">
                <LargeTextButtons/>
                <img src={logo} alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
                <h1>Click on a category to add more!<br></br></h1>
            </div>
        ))}
    </>
    );
}

export default CustomerHome;