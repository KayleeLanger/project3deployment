import { useState } from "react"; 
import logo from "./logo.svg";
import Inventory from "./views/Inventory";
import OrderTrends from "./views/OrderTrends";
import Employees from "./views/Employees"; // New import for Employee Management
import HomeScreen from "./views/HomeScreen"; //homescreen
import Prices from './views/Prices';
import Menu from './views/Menu';
import Graph from './views/Graph';
//import Categories from './views/Categories';
import Button from './Button';


function App() { //main function, will be mostly imports eventually
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
			{screen === "inventory" && <Inventory setScreen={setScreen} />}
			{screen === "order-trends" && <OrderTrends setScreen={setScreen} />}
			{screen === "employees" && <Employees setScreen={setScreen} />}
			{screen === "prices" && <Prices setScreen={setScreen} />}
			{screen === "menu" && <Menu setScreen={setScreen} />}
			{screen === "graph" && <Menu setScreen={setScreen} />}
			{/*{screen === "categories" && <Categories setScreen={setScreen} />}*/}

			{/* customer */}
			{screen === "customer" && <CustomerHomeScreen setScreen={setScreen} />}
		</header>
		</div>
	);
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
function ManagerScreen({ setScreen }) {
	return (
		<>
		<h1>Manager Dashboard</h1>
		<div className="manager-menu" style={{ 
			display: 'flex', 
			flexDirection: 'column',
			gap: '10px',
			maxWidth: '300px'
		}}>
			<Button text="View Inventory" onClick={() => setScreen("inventory")} />
			<Button text="View Order Trends" onClick={() => setScreen("order-trends")} />
			<Button text="Employee Management" onClick={() => setScreen("employees")} />
			<Button text="Prices" onClick={() => setScreen("prices")} />
			<Button text="Menu" onClick={() => setScreen("menu")} />
			<Button text="Employee View" onClick={() => setScreen("categories")} />
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