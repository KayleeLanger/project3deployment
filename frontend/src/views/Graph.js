import { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FF0000", "#00FF00"];

function Graph({ setScreen }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchGraphData = async () => {
    if (!startDate || !endDate) {
      setError("Please enter both start and end dates.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory-usage?start=${startDate}&end=${endDate}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      const used = Number(result.used) || 0;
      const instock = Number(result.instock) || 0;

      setData([
        { name: "Used", value: used },
        { name: "In Stock", value: instock }
      ]);
      setError("");
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Usage Chart</h2>
      <div>
        <label>Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
        <label style={{ marginLeft: 10 }}>End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
        <button style={{ marginLeft: 10 }} onClick={fetchGraphData}>Results</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={150} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <button onClick={() => setScreen("orderTrends")}>Back</button>
    </div>
  );
}

export default Graph;
