import { useState, useEffect } from "react";
 import "./Customer.css";
 import logo from "./Images/team_00_logo.png";
 import * as functions from "./functions.js";
 import { getToppingImage } from "./functions";
 import LargeTextButtons from "./LargeTextButton.js";
 
 
 function CustomerToppingsScreen({ setScreen, setSelectedCategory, selectedCategory, OrderDetails, setorderDetails, cameFromCustomization }) {
     const [currentTime, setCurrentTime] = useState(new Date());
     const [toppings, setToppings] = useState([]);
     const [selectedToppings, setSelectedToppings] = useState([]);
 
     const categories = [
             { name: "Milk Tea" }, { name: "Brewed Tea" }, { name: "Ice Blended" },
             { name: "Fresh Milk" }, { name: "Fruit Tea" }, { name: "Tea Mojito" },
             { name: "Seasonal" }, { name: "Miscellaneous" }
         ];
 
     useEffect(() => {
         const getToppings = async () => {
             try {
                 const response = await fetch(`${process.env.REACT_APP_API_URL}/api/toppings`);
                 if (!response.ok) throw new Error("Failed to fetch toppings");
                 const data = await response.json();
                 const filteredToppings = data.filter(item => item.othertype === "topping");
                 setToppings(filteredToppings);
             } catch (error) {
                 console.error(error);
                 setToppings([]);
             }
         };
         getToppings();
     }, []);
 
     useEffect(() => {
         const interval = setInterval(() => {
             setCurrentTime(new Date());
         }, 1000);
         return () => clearInterval(interval);
     }, []);
 
     useEffect(() => {
         if (!cameFromCustomization) return;
         const lastOrder = OrderDetails[OrderDetails.length - 1];
         if (lastOrder && lastOrder.toppings && lastOrder.toppings !== "none") {
             const toppingsList = lastOrder.toppings.split(", ").map(t => t.split(" (+")[0]);
             setSelectedToppings(toppingsList);
         } else {
             setSelectedToppings([]);
         }
     }, [cameFromCustomization, OrderDetails]);
 
     const toggleTopping = (name, price) => {
         if (cameFromCustomization) {
             setorderDetails(prevDetails => {
                 const updated = [...prevDetails];
                 const idx = updated.length - 1;
 
                 let toppingsList = updated[idx].toppings && updated[idx].toppings !== "none"
                     ? updated[idx].toppings.split(", ")
                     : [];
                 let itemPrice = parseFloat(updated[idx].price);
 
                 //Check if this topping already exists
                 const toppingEntry = `${name} (+$${parseFloat(price).toFixed(2)})`;
                 const toppingNamesOnly = toppingsList.map(t => t.split(" (+")[0]); //remove (+$) to compare by name
 
                 if (toppingNamesOnly.includes(name)) {
                     //Remove topping
                     toppingsList = toppingsList.filter(t => !t.startsWith(name));
                     itemPrice -= parseFloat(price);
                 } else {
                     //Add topping
                     toppingsList.push(toppingEntry);
                     itemPrice += parseFloat(price);
                 }
 
                 updated[idx] = {
                     ...updated[idx],
                     toppings: toppingsList.length > 0 ? toppingsList.join(", ") : "none",
                     price: itemPrice.toFixed(2)
                 };
                 return updated;
             });
 
             setSelectedToppings(prev =>
                 prev.includes(name)
                     ? prev.filter(t => t !== name)
                     : [...prev, name]
             );
         } else {
             //standalone topping logic
             setorderDetails(prevDetails => {
                 const last = prevDetails[prevDetails.length - 1];
                 const isSameTopping = last?.name === name && last.size === "n/a" && last.ice === "n/a";
                 if (isSameTopping) {
                     return prevDetails.slice(0, -1);
                 }
                 return [...prevDetails, {
                     name,
                     price: price?.toFixed(2) || "0.00",
                     size: "n/a",
                     ice: "n/a",
                     sweetness: "n/a",
                     toppings: "n/a",
                     quantity: "1",
                     image: getToppingImage(name)
                 }];
             });
 
             setSelectedToppings(prev =>
                 prev.includes(name)
                     ? prev.filter(t => t !== name)
                     : [...prev, name]
             );
         }
     };
 
 
     return (
 
         <>
             <div className="sidebar">
                 <div className="time-box">
                     <h2>{currentTime.toLocaleTimeString()}</h2>
                     <strong>{currentTime.toLocaleDateString()}</strong>
                 </div>
                 <functions.WeatherEntry/>
                 {categories.map((category) => (
                     <functions.SideButton
                         key={category.name}
                         text={category.name}
                         onClick={() => setScreen("customer-drinks")}
                     />
                 ))}
 
                 <functions.SpecialSideButton
                     text="Individual Toppings"
                     onClick={() => setScreen("customer-toppings")}
                 />
 
                 {/*Add checkout button if there are order details*/}
                 {OrderDetails.length > 0 && (
                     <functions.SideButton
                         text="Checkout"
                         onClick={() => setScreen("confirm")}
                     />
                 )}
 
                 
                 {/* BUTTON THAT TAKES YOU BACK HOME */}
                 <functions.SideButton
                     text="Home"
                     onClick={() => setScreen("home")}
                 />
             </div>
 
 
             <div className="homeScreen">
                 <functions.XButton text="X" onClick={() => setScreen("customer")} />
                 <h1>Single Topping</h1>
                 <div className="mainBody">
                     {toppings.length > 0 ? (
                         toppings.map(topping => (
                             <div className="buttonBox" key={topping.othername}>
                                 <functions.CustomerDrinkButton
                                     text={`${topping.othername} (+$${parseFloat(topping.otherprice).toFixed(2)})`}
                                     image={getToppingImage(topping.othername)}
                                     selected={selectedToppings.includes(topping.othername)}
                                     onClick={() => toggleTopping(topping.othername, topping.otherprice)}
                                 />
                             </div>
                         ))
                     ) : (
                         <p>No toppings available. Please check back later!</p>
                     )}
                 </div>
 
                 {cameFromCustomization && (
                     <div style={{ marginTop: "20px", textAlign: "center" }}>
                         <functions.Button
                             text="Done"
                             onClick={() => setScreen("confirm")}
                         />
                     </div>
                 )}
             </div>
             <LargeTextButtons/>
         </>
     );
 }
 
 export default CustomerToppingsScreen;