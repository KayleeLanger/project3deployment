import { useState, useEffect } from "react";

function Inventory({ setScreen }) {
	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [salesReport, setSalesReport] = useState([]);
	const [reportError, setReportError] = useState(null);

	useEffect(() => {
		const fetchInventory = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invent`);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
				const data = await response.json();
				setInventory(data);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchInventory();
	}, []);

	const generateSalesReport = async () => {
		if (!startDate || !endDate) {
			setReportError("Start and end dates are required");
			return;
		}

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sales-report?start=${startDate}&end=${endDate}`);
			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			const data = await response.json();
			setSalesReport(data);
			setReportError(null);
		} catch (err) {
			console.error(err);
			setReportError("Failed to generate sales report");
		}
	};

	if (loading) return <div>Loading inventory data...</div>;
	if (error) return <div>Error loading inventory: {error}</div>;

	return (
		<div>
			<h1>Inventory Management</h1>

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

			<div>
				<h3>Inventory Summary</h3>
				<p>Total Items: {inventory.length}</p>
				<p>Items Low on Stock: {inventory.filter(item => item.remaininginstock < 20).length}</p>
			</div>

			<div>
				<h2>Sales Report</h2>
				<div>
					<label>Start Date: </label>
					<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
					<label>End Date: </label>
					<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
					<button onClick={generateSalesReport}>Generate Report</button>
					{reportError && <p style={{ color: 'red' }}>{reportError}</p>}
				</div>

				{salesReport.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>Drink Name</th>
								<th>Total Sold</th>
								<th>Total Revenue</th>
							</tr>
						</thead>
						<tbody>
							{salesReport.map((entry, index) => (
								<tr key={index}>
									<td>{entry.drinkname}</td>
									<td>{entry.totalsold}</td>
									<td>{entry.totalrevenue}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			<div>
				<button onClick={() => setScreen("manager")}>Back to Manager</button>
			</div>
		</div>
	);
}

export default Inventory;
