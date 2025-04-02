
export function Button({ text, onClick }) {
    return <button onClick={onClick}>{text}</button>;
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
        onClick={onClick}>{text}</button>;
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

export function SizeSelector({ selectedSize, setSelectedSize , details , setDetails }) {
	return (
	    <div className="option-row">
            <div className="option-label">Size</div>
            <div className="option-buttons">
            <button
                className={selectedSize === "regular" ? "selected" : ""}
                onClick={() => {
                    setSelectedSize("regular");
                    customize("size", "regular", details, setDetails);
                }}
            >
                Regular
            </button>
            <button
                className={selectedSize === "large" ? "selected" : ""}
                onClick={() => {
                    setSelectedSize("large");
                    customize("size", "large", details, setDetails);
                }}
            >
                Large
            </button>
            </div>
        </div>
    );
}

export function IceSelector({ selectedIce, setSelectedIce , details , setDetails }) {
	return (
	    <div className="option-row">
            <div className="option-label">Ice</div>
            <div className="option-buttons">
            <button
                className={selectedIce === "no" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("no");
                    customize("ice", "no" , details, setDetails);
                }}
            >
                No
            </button>
            <button
                className={selectedIce === "less" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("less");
                    customize("ice", "less" , details, setDetails);
                }}
            >
                Less
            </button>
            <button
                className={selectedIce === "regular" ? "selected" : ""}
                onClick={() => {
                    setSelectedIce("regular");
                    customize("ice", "regular" , details, setDetails);
                }}
            >
                Regular
            </button>
            </div>
        </div>
	);
}

export function SweetnessSelector({selectedSweetness, setSelectedSweetness, details , setDetails}) {  
	const sweetnessOptions = ["0%", "25%", "50%", "75%", "100%"];

	return (
	    <div className="option-row">
            <div className="option-label">Sweetness</div>

            <div className="option-buttons">
            {sweetnessOptions.map(option => (
                <button
                key={option}
                onClick={() => {
                    setSelectedSweetness(option);
                    customize("sweetness", option , details, setDetails);
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

export function customize(option, custom, details , setDetails) {
	details[details.length - 1] = {
		...details[details.length - 1],
		[option]: custom,
	};
	setDetails(details);
}