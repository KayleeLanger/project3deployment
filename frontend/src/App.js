import { useState } from "react"; 
import CustomerHome from "./views/CustomerHome.js";
import CustomerDrinks from "./views/CustomerDrinks.js";
import Inventory from "./views/Inventory";
import EmployeeCategoryScreen from "./views/EmployeeCategoryScreen";
import EmployeeToppingsScreen from "./views/EmployeeToppingsScreen.js";
import EmployeeDrinks from "./views/EmployeeDrinks";
import EmployeeCustomization from "./views/EmployeeCustomization";
import OrderTrends from "./views/OrderTrends";
import Employees from "./views/Employees"; // New import for Employee Management
import HomeScreen from "./views/HomeScreen"; //homescreen
import Prices from './views/Prices';
import Menu from './views/Menu';
import MenuBoard from "./views/MenuBoard";
import Graph from './views/Graph';
//import Categories from './views/Categories';
import Button from './Button';



function App() { //main function, will be mostly imports eventually

	const [screen, setScreen] = useState("home");
	const [selectedCategory, setSelectedCategory] = useState(""); 
	const [orderDetails, setOrderDetails] = useState([]); 
	const [currentEditIdx, setCurrentEditIdx] = useState(null);
	

	return (
		<div className="App">
		<header className="App-header">
			{screen === "home" && <HomeScreen setScreen={setScreen} />}
			{/* cashier */}
			{screen === "cashier" && <EmployeeCategoryScreen setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails}
										setCurrentEditIdx={setCurrentEditIdx} />}
			{screen === "cashier-drinks" && <EmployeeDrinks setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										selectedCategory={selectedCategory} 
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails}
										setCurrentEditIdx={setCurrentEditIdx} />}
			{screen === "cashier-customization" && <EmployeeCustomization setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										selectedCategory={selectedCategory} 
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails}
										currentEditIdx={currentEditIdx}
										setCurrentEditIdx={setCurrentEditIdx} />}
			{screen === "cashier-toppings" && <EmployeeToppingsScreen setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										selectedCategory={selectedCategory} 
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails}
										currentEditIdx={currentEditIdx}
										setCurrentEditIdx={setCurrentEditIdx} />}


			
			{/* manager */}
			{screen === "manager" && <ManagerScreen setScreen={setScreen} />}
			{screen === "inventory" && <Inventory setScreen={setScreen} />}
			{screen === "order-trends" && <OrderTrends setScreen={setScreen} />}

			{screen === "employees" && <Employees setScreen={setScreen} />}
			{screen === "prices" && <Prices setScreen={setScreen} />}
			{screen === "menu" && <Menu setScreen={setScreen} />}
			{screen === "graph" && <Graph setScreen={setScreen} />}
			

			{/* customer */}
			{screen === "customer" && <CustomerHome setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails} />}
			{screen === "customer-drinks" && <CustomerDrinks setScreen={setScreen}
										setSelectedCategory={setSelectedCategory}
										selectedCategory={selectedCategory} 
										OrderDetails={orderDetails}
										setorderDetails={setOrderDetails} />}

			{/* menu board */}
			{screen === "menu-board" && <MenuBoard setScreen={setScreen} />}
		</header>
		</div>
	);
}


/////////////////////// Home Screen ///////////////////////
// function HomeScreen({ setScreen }) {
// 	return (
// 		<>
// 		<img src={logo} className="App-logo" alt="logo" />
// 		<p>Edit <code>src/App.js</code> and save to reload. (THIS WILL BE THE HOMESCREEN EVENTUALLY)</p>

// 		<Button text="Go to Cashier" onClick={() => setScreen("cashier")} />
// 		<Button text="Go to Manager" onClick={() => setScreen("manager")} />
// 		<Button text="Go to Customer" onClick={() => setScreen("customer")} />

// 		<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
// 			Learn React
// 		</a>
// 		</>
// 	);
// }
// /////////////////////// Reusable Design Components ///////////////////////
// function Button({ text, onClick }) {
// 	return <button onClick={onClick}>{text}</button>;
// }


/////////////////////// Cashier Pages ///////////////////////
// function CashierCategoriesScreen({ setScreen }) {
// 	return (
// 		<>
// 		<h1>Cashier Categories</h1>
		
// 		<Button text="Logout" onClick={() => setScreen("home")} />
// 		<Button text="Go to Drinks" onClick={() => setScreen("cashier-drinks")} />
// 		</>
// 	);
// }



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
			<Button text="Employee View" onClick={() => setScreen("cashier")} />
			<Button text="Logout" onClick={() => setScreen("home")} />
		</div>
		</>
	);
}
///////////////////////////////////////////////////////////////////////


export default App;