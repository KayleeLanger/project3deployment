import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div className="App">
      <header className="App-header">
        {screen === "home" && <HomeScreen setScreen={setScreen} />}
        {/* cashier */}
        {screen === "cashier" && <CashierCategoriesScreen setScreen={setScreen} />}
        {screen === "cashier-drinks" && <CashierDrinkScreen setScreen={setScreen} />}
        {/* manager */}
        {screen === "manager" && <ManagerScreen setScreen={setScreen} />}
        {/* customer */}
        {screen === "customer" && <CustomerHomeScreen setScreen={setScreen} />}
        
      </header>
    </div>
  );
}

/////////////////////// Home Screen ///////////////////////
function HomeScreen({ setScreen }) {
  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <p>Edit <code>src/App.js</code> and save to reload. (THIS WILL BE THE HOMESCREEN EVENTUALLY)</p>

      <Button text="Go to Cashier" onClick={() => setScreen("cashier")} />
      <Button text="Go to Manager" onClick={() => setScreen("manager")} />
      <Button text="Go to Customer" onClick={() => setScreen("customer")} />

      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </>
  );
}
/////////////////////// Reusable Design Components ///////////////////////
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}


/////////////////////// Cashier Pages ///////////////////////
function CashierCategoriesScreen({ setScreen }) {
  return (
    <>
      <h1>Cashier Categories</h1>
      
      <Button text="Logout" onClick={() => setScreen("home")} />
      <Button text="Go to Drinks" onClick={() => setScreen("cashier-drinks")} />
    </>
  );
}

function CashierDrinkScreen({ setScreen }) {
  return (
    <>
      <h1>Cashier - Drinks</h1>
      <Button text="Back to Categories" onClick={() => setScreen("cashier")} />
    </>
  );
}

//////////////// Manager Pages ////////////////////////////////////////
function ManagerScreen({ setScreen }) { // Sara made this you can delete but needed something here
  return (
      <Button text="Logout" onClick={() => setScreen("home")} />
      
  );
}
///////////////////////////////////////////////////////////////////////

////////////////////////////////Customer Pages//////////////////////////
function CustomerHomeScreen({ setScreen }) { // Sara made this you can delete but needed something here
  return (
      <Button text="Home" onClick={() => setScreen("home")} />
      
  );
}
///////////////////////////////////////////////////////////////////////
export default App;
