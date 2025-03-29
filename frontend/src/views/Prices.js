import { useEffect, useState } from "react";

function Prices({ setScreen }) {
	const [prices, setPrices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prices`);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
				const data = await response.json();
				setPrices(data);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPrices();
	}, []);

	if (loading) return <div>Loading prices...</div>;
	if (error) return <div>Error loading prices: {error}</div>;

	return (
		<div>
			<h1>Drink Prices</h1>

			<table>
				<thead>
					<tr>
						<th>Drink Name</th>
						<th>Price ($)</th>
					</tr>
				</thead>
				<tbody>
					{prices.map((drink, index) => (
						<tr key={index}>
							<td>{drink.drinkname}</td>
							<td>${parseFloat(drink.drinkprice).toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div>
				<button onClick={() => setScreen("manager")}>Back to Manager</button>
			</div>
		</div>
	);
}

export default Prices;
