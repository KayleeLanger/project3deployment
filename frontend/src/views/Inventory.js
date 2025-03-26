import { useState, useEffect } from "react";

function Inventory({ setScreen }) {
  	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
		const fetchInventory = async () => {
			try {
			//const response = await fetch("http://localhost:8080/api/invent"); // connects to index.js
			const response = fetch(`${process.env.REACT_APP_API_URL}/api/invent`)

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			
			const data = await response.json();
			setInventory(data);
			setLoading(false);
			} catch (err) {
			console.error(err);
			setError(err.message);
			setLoading(false);
			}
		};

      fetchInventory();
    }, []);

    if (loading) return <div>Loading inventory data...</div>;
    if (error) return <div>Error loading inventory: {error}</div>;

    return (
      <div>
        <h1>Inventory Management</h1>
        
        <div>
			<table>
				<thead>
				<tr>
					<th>ID</th>
					<th>Item Name</th>
					<th>Sold Today</th>
					<th>Remaining Stock</th>
					<th>Status</th>
				</tr>
				</thead>
				<tbody>
					{inventory.map((item) => (
						<tr key={item.inventoryid}>
							<td>{item.inventoryid}</td>
							<td>{item.itemname}</td>
							<td>{item.soldforday}</td>
							<td>{item.remaininginstock}</td>
							<td>
								{item.remaininginstock < 10 ? "Low Stock!" : 
								item.remaininginstock < 20 ? "Order Soon" : "OK"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
        </div>
        
        <div>
        	<h3>Inventory Summary</h3>
        	<p>Total Items: {inventory.length}</p>
        	<p>Items Low on Stock: {inventory.filter(item => item.remaininginstock < 20).length}</p>
        </div>
        
        <div>
        	<button onClick={() => setScreen("manager")}>Back to Manager</button>
        </div>
      </div>
    );
}

export default Inventory;
