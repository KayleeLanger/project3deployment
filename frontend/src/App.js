import { useState } from "react";
import logo from "./logo.svg";
import Inventory from "./views/Inventory";
import EmployeeCategoryScreen from "./views/EmployeeCategoryScreen";
import EmployeeDrinks from "./views/EmployeeDrinks";
import EmployeeCustomization from "./views/EmployeeCustomization";
import OrderTrends from "./views/OrderTrends";


function App() {
	const [screen, setScreen] = useState("home");

	return (
		<div className="App">
		<header className="App-header">
			{screen === "home" && <HomeScreen setScreen={setScreen} />}
			{/* cashier */}
			{screen === "cashier" && <EmployeeCategoryScreen setScreen={setScreen} />}
			{screen === "cashier-drinks" && <EmployeeDrinks setScreen={setScreen} />}
			{screen === "cashier-customization"} && <EmployeeCustomization setScreen={setScreen} />
			
			{/* manager */}
			{screen === "manager" && <ManagerScreen setScreen={setScreen} />}
			{screen === "inventory" && <Inventory setScreen={setScreen} />}
			{screen === "order-trends" && <OrderTrends setScreen={setScreen} />}
			\
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




//////////////// Manager Pages ////////////////////////////////////////
function ManagerScreen({ setScreen }) {
	return (
		<>
		<h1>Manager Dashboard</h1>
		<div className="manager-menu">
			<Button text="View Inventory" onClick={() => setScreen("inventory")} />
			<Button text="View Order Trends" onClick={() => setScreen("order-trends")} />
			<Button text="Logout" onClick={() => setScreen("home")} />
		</div>
		</>
	);
}
///////////////////////////////////////////////////////////////////////

////////////////////////////////Customer Pages//////////////////////////
function CustomerHomeScreen({ setScreen }) {
	return (
		<Button text="Home" onClick={() => setScreen("home")} />
	);
}
///////////////////////////////////////////////////////////////////////
export default App;
