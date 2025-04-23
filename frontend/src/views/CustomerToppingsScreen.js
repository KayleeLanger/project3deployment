import { useState, useEffect } from "react";
import "./Customer.css";
import logo from "./Images/team_00_logo.png"; 
import * as functions from "./functions.js";
import { getToppingImage } from "./functions";

function CustomerToppingsScreen({ setScreen, setSelectedCategory, selectedCategory, OrderDetails, setorderDetails, cameFromCustomization }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [toppings, setToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);


    /// category list: hardcoded since categories won't change, only drinks
    const categories = [
        {name: "Milk Tea"}, {name: "Brewed Tea"}, {name: "Ice Blended"},
        {name: "Fresh Milk"}, {name: "Fruit Tea"}, {name: "Tea Mojito"},
        {name: "Crema"}, {name: "Seasonal"}, {name: "Miscellaneous"}
    ];

    // fetch toppings from API when screen loads
    useEffect(() => {
        const getToppings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/toppings`);
                if (!response.ok) throw new Error("Failed to fetch toppings");
                const data = await response.json();
                console.log("Raw data from /api/toppings:", data);

                // Filter for toppings only (vs misc)
                const filteredToppings = data.filter(item => item.othertype === "topping");
                console.log("Filtered toppings:", filteredToppings);
                setToppings(filteredToppings);
            } catch (error) {
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

    // function to load topping image by name
    const importImage = (name) => {
        try {
            return require(`./Images/toppings/${name.toLowerCase().replace(/ /g, "_")}.png`);
        } catch (err) {
            return logo; // fallback image
        }
    };

    // highlight all selected toppings
    useEffect(() => {
        if (!cameFromCustomization) return;
    
        const lastOrder = OrderDetails[OrderDetails.length - 1];
    
        if (lastOrder && lastOrder.toppings && lastOrder.toppings !== "none") {
            const toppingsList = lastOrder.toppings
                .split(", ")
                .map(t => t.split(" (+")[0]); // Remove price text
            setSelectedToppings(toppingsList);
        } else {
            setSelectedToppings([]);
        }
    }, [cameFromCustomization, OrderDetails]);
    

    // selects multiple toppings
    const toggleTopping = (name) => {
        setSelectedToppings(prev =>
        prev.includes(name)
            ? prev.filter(t => t !== name)
            : [...prev, name]
        );
    };

    return (
        <>
            {/* Sidebar (logout, time, cancel order)*/}
            <div className="sidebar">
                <div className="time-box">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <strong>{currentTime.toLocaleDateString()}</strong>
                </div>

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
                <div className="mainBody">
                    {/* loop through toppings */}
                    {toppings.length > 0 ? (
                        toppings.map((topping) => {
                            const toppingLabel = `${topping.othername} (+$${parseFloat(topping.otherprice).toFixed(2)})`;

                            return (
                                <div className="buttonBox" key={topping.othername}>
                                    <functions.CustomerDrinkButton
                                        text={toppingLabel}
                                        image={importImage(topping.othername)}
                                        selected={selectedToppings.includes(topping.othername)}
                                        onClick={() => {
                                            toggleTopping(topping.othername);

                                            if (cameFromCustomization) {
                                                // ADD TO EXISTING DRINK
                                                setorderDetails(prevDetails => {
                                                    const idx = prevDetails.length - 1;
                                                    const updated = [...prevDetails];

                                                    const existingToppings = updated[idx].toppings && updated[idx].toppings !== "none"
                                                        ? updated[idx].toppings + `, ${toppingLabel}`
                                                        : toppingLabel;

                                                    const newPrice = parseFloat(updated[idx].price) + parseFloat(topping.otherprice);

                                                    updated[idx] = {
                                                        ...updated[idx],
                                                        toppings: existingToppings,
                                                        price: newPrice.toFixed(2)
                                                    };
                                                    return updated;
                                                });
                                                // setScreen("confirm");
                                            } else {
                                                // TOPPING ONLY MODE: toggle add/remove
                                                setorderDetails(prevDetails => {
                                                    const last = prevDetails[prevDetails.length - 1];
                                            
                                                    const isSameTopping =
                                                        last?.name === topping.othername &&
                                                        last.size === "n/a" &&
                                                        last.ice === "n/a";
                                            
                                                    if (isSameTopping) {
                                                        // Deselect: remove the topping-only item
                                                        return prevDetails.slice(0, -1);
                                                    }
                                            
                                                    // Add new topping-only item
                                                    return [
                                                        ...prevDetails,
                                                        {
                                                            name: topping.othername,
                                                            price: topping.otherprice?.toFixed(2) || "0.00",
                                                            size: "n/a",
                                                            ice: "n/a",
                                                            sweetness: "n/a",
                                                            toppings: "n/a",
                                                            quantity: "1",
                                                            image: getToppingImage(topping.othername)
                                                        },
                                                    ];
                                                });
                                            }
                                            
                                        }}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p>No toppings available. Please check back later!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CustomerToppingsScreen;
