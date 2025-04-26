// import React, { useState, useEffect } from "react";

// export function WeatherEntry() {
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch weather data
//   const fetchWeather = async () => {
//     try {
//       const response = await fetch(
//         "https://api.openweathermap.org/data/3.0/onecall?lat=30.6210&lon=-96.3255&appid=892b7cd320c8d96764bf6dada5417803&units=imperial"
//       );
//       if (!response.ok) throw new Error("Failed to get weather, try again later");
//       const data = await response.json();

//       setWeather({
//         temperature: data.current.temp,
//         description: data.current.weather[0].description, //Word discription of image (Accesisble :) 
//         icon: data.current.weather[0].icon, // e.g. "01d"
//       });
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     // Fetch weather immediately on mount
//     fetchWeather();

//     // Set up interval to fetch weather every 10 minutes (600000 ms)
//     const intervalId = setInterval(fetchWeather, 600000);

//     // Clear interval on cleanup
//     return () => clearInterval(intervalId);
//   }, []);

//   // Handling loading state
//   if (!weather && !error) return <div className="weather">Loading weather...</div>;

//   // Handling error state
//   if (error) return <div className="weather text-red-500">Error: {error}</div>;

//   // Construct the icon URL
//   const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;

//   return (
//     <div className="weatherBox">
//       <table style="text-align: center">
//         <tr>
//             <td> <img src={iconUrl} alt={weather.description} style={"center"} />
//               <p>{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p></td>
//             <td><p>{weather.temperature.toFixed(1)}°F</p></td>
//         </tr>
//       </table>
//     </div>
//   );
// }









export function Button({ text, onClick }) {
    return (
        <button
            style={{
                backgroundColor: "#38bdf8 ",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer"
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}


export function AccessButton({ text = "Aa", onClick }) {
    return (
        <button
            style={{
                position: "absolute",
                bottom: "100px",
                left: "270px",
                backgroundColor: "rgb(19, 90, 120)",
                color: "black",
                border: "10px",
                borderColor: "black",
                borderRadius: "50px",
                fontSize: "40px",
                cursor: "pointer",
                padding: "10px 20px",
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}


export function CategoryButton({ text, onClick }) {
    return <button
        style={{
            backgroundColor: "rgb(19, 90, 120)",
            color: "white" ,
            width: "200px",
            height: "200px",
            margin: "20px",
            padding: "20px"
            }}
            onClick={onClick}>{text}
    </button>;
}


export function SideButton({ text, onClick }) {
    return <button
        style={{
            backgroundColor: "rgb(99, 99, 99)",
            color: "white" ,
            fontFamily: "Verdana, Tahoma, sans-serif",
            width: "250px",
            height: "45px",
            padding: "20px", 
            margin: "5px",
            border: "3px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            }}
            onClick={onClick}>{text}
    </button>;
}


export function SpecialSideButton({ text, onClick }) {
    return <button
        style={{
            backgroundColor: "rgb(50, 50, 50)",
            color: "white" ,
            fontFamily: "Verdana, Tahoma, sans-serif",
            width: "250px",
            height: "45px",
            padding: "20px", 
            margin: "5px",
            border: "3px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            }}
            onClick={onClick}>{text}
    </button>;
}

export function defaultVal (orders, setOrders) {
    // copy of orderdetails
    const updatedOrderDetails = [...orders];
    
    // last item in order
    const lastOrder = updatedOrderDetails[updatedOrderDetails.length - 1];
    
    if (lastOrder.size === "") {
        lastOrder.size = "regular";
    }
    if (lastOrder.ice === "") {
        lastOrder.ice = "regular";
    }
    if (lastOrder.sweetness === "") {
        lastOrder.sweetness = "100%";
    }
    if (lastOrder.toppings === "") {
        lastOrder.toppings = "none";
    }
    setOrders(updatedOrderDetails);
}

export function checkout (numItems, orderTotal) {
    const executeCheckout = async () => {
    try {
        const orderDate = getCurrentDateTime();
        console.log(orderDate);
        const employeeId = '123460';
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numItems,
                orderTotal,
                orderDate,
                employeeId,
            }),
        });
        if (!response.ok) throw new Error ("Failed to place order");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
    executeCheckout();
}

export function getCurrentDateTime() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function XButton({ text, onClick }) {
    return <button
    style={{
        backgroundColor: "rgb(120, 19, 19)",
        color: "white",
        borderRadius: "50px",
    }}
    onClick={onClick}>{text}</button>;
}

export function DrinkButton({ text, onClick }) {
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

export function CustomerDrinkButton({ text, image, onClick , selected}) {
    return (
        <button
            style={{
            // Colors
            backgroundColor: selected ? "#ffe680" : "#39D6DE",
            color: "black",
            // Button Spacing
            width: "300px",
            height: "300px",
            margin: "20px",
            padding: "10px",
            // allowing for image
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // rounded  edges/ border
            border: "4px",
            borderColor: "black",
            borderRadius: "10px",
            }}
            onClick={onClick}
        >
        {/* IMAGE: Long you may need to edit this to get dimensions right for photos */}
        {image && (
            <img
                src={image}
                alt={text}
                style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "10px"
                }}
            />
        )}
        <span style={{ fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>
            {text}
        </span>
        </button>
    );
}



export function SizeSelector({ selectedSize, setSelectedSize , details , setDetails, currentEditIdx, page }) {
	return (
	    <div className="option-row">
            <div className={page === "customer" ? "option-label-customer" : "option-label"}>Size</div>
            <div className="option-buttons">
                <button
                    className={selectedSize === "regular" ? "selected" : ""}
                    onClick={() => {
                        setSelectedSize("regular");
                        customize("size", "regular", details, setDetails, currentEditIdx);
                    }}
                >
                    Regular
                </button>
                <button
                    className={selectedSize === "large" ? "selected" : ""}
                    onClick={() => {
                        setSelectedSize("large");
                        customize("size", "large", details, setDetails, currentEditIdx);
                    }}
                >
                    Large
                </button>
            </div>
        </div>
    );
}

export function IceSelector({ selectedIce, setSelectedIce , details , setDetails, currentEditIdx , page }) {
	return (
	    <div className="option-row">
            <div className={page === "customer" ? "option-label-customer" : "option-label"}>Ice</div>
            <div className="option-buttons">
            <button
                className={selectedIce === "no" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("no");
                    customize("ice", "no" , details, setDetails, currentEditIdx);
                }}
            >
                No
            </button>
            <button
                className={selectedIce === "less" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("less");
                    customize("ice", "less" , details, setDetails, currentEditIdx);
                }}
            >
                Less
            </button>
            <button
                className={selectedIce === "regular" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("regular");
                    customize("ice", "regular" , details, setDetails, currentEditIdx);
                }}
            >
                Regular
            </button>
            </div>
        </div>
	);
}

export function SweetnessSelector({selectedSweetness, setSelectedSweetness, details , setDetails, currentEditIdx, page}) {  
	const sweetnessOptions = ["0%", "25%", "50%", "75%", "100%"];

	return (
        <div className="option-row">
            <div className={page === "customer" ? "option-label-customer" : "option-label"}>Sweetness</div>
            <div className="option-buttons">
            {sweetnessOptions.map(option => (
                <button
                key={option}
                onClick={() => {
                    setSelectedSweetness(option);
                    customize("sweetness", option , details, setDetails, currentEditIdx);
                }}
                className={selectedSweetness === option ? "selected" : ""}
                >
                {option}
                </button>
            ))}
            </div>
        </div>
	);
}

export function customize(option, custom, details, setDetails, currentEditIdx) {
	const idx = currentEditIdx != null ? currentEditIdx : details.length - 1;
    details[idx] = {
		...details[idx],
		[option]: custom,
	};
	setDetails(details);
}

export function deleteItem(index, orderdetails, setorderDetails, setScreen, page) {
    const updated = [...orderdetails];
    updated.splice(index, 1);
    setorderDetails(updated);

    if (setScreen && index === orderdetails.length - 1 && updated.length === 0) {
        if (page === "customer") {
            setScreen("customer");
        } else {
            setScreen("cashier");
        }
    }
}

export function editItem(index, setCurrentEditIdx, setScreen, page) {
    setCurrentEditIdx(index);
    if (page === "customer") {
        setScreen("customer-customization");
    }
    else {
        setScreen("cashier-customization");
    }
}

export function getDrinkImage(drinkName) {
    try {
        const formatted = drinkName.toLowerCase().replace(/\s+/g, "_");
        return require(`./Images/drinks/${formatted}.png`);
    } catch {
        return require("./Images/team_00_logo.png"); // fallback image if image not found
    }
}

export function getToppingImage(toppingName) {
    try {
        const formatted = toppingName.toLowerCase().replace(/\s+/g, "_");
        return require(`./Images/toppings/${formatted}.png`);
    } catch {
        return require("./Images/team_00_logo.png");
    }
}

export function getMiscImage(miscName) {
    try {
        const formatted = miscName.toLowerCase().replace(/\s+/g, "_");
        return require(`./Images/misc/${formatted}.png`);
    } catch {
        return require("./Images/team_00_logo.png"); //fallback if not found
    }
}