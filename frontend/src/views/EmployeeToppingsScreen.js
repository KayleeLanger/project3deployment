import { useState } from "react";
import "./Employee.css";

function EmployeeToppingsScreen({ setScreen }) {
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Hardcoded toppings for now — backend will replace this later
  const toppings = [
    { name: "Pearl", price: 0.50 },
    { name: "Mini Pearl", price: 0.50 },
    { name: "Ice Cream", price: 0.75 },
    { name: "Pudding", price: 0.50 },
    { name: "Aloe Vera", price: 0.60 },
    { name: "Red Bean", price: 0.55 },
    { name: "Herb Jelly", price: 0.50 },
    { name: "Alyu Jelly", price: 0.50 },
    { name: "Lychee Jelly", price: 0.50 },
    { name: "Creama", price: 0.60 }
  ];

  const toggleTopping = (name) => {
    setSelectedToppings(prev =>
      prev.includes(name)
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={() => setScreen("cashier-customization")}>Back</button>
      </div>

      {/* Main content */}
      <div className="container">
        <div className="main">
          <h1>Classic Milk Tea</h1>
          <div className="toppings-grid">
            {toppings.map(({ name, price }) => (
              <button
                key={name}
                className={`topping-button ${selectedToppings.includes(name) ? "selected" : ""}`}
                onClick={() => toggleTopping(name)}
              >
                {name} (+${price.toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order summary area (leave to Felicia) */}
      <div className="order">
        <h1>Order Summary</h1>
        {/* Example of selected toppings list (optional visual aid) */}
        <ul>
          {selectedToppings.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default EmployeeToppingsScreen;
