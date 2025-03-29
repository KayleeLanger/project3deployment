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
    fetchInventory();
  }, []);

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

  const handleEdit = (item) => {
    const newQty = prompt(`Enter new quantity for ${item.itemname}:`, item.remaininginstock);
    if (newQty !== null) {
      fetch(`${process.env.REACT_APP_API_URL}/api/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryId: item.inventoryid,
          newQuantity: parseInt(newQty)
        })
      }).then(() => {
        setInventory(prev =>
          prev.map(i =>
            i.inventoryid === item.inventoryid
              ? { ...i, remaininginstock: parseInt(newQty) }
              : i
          )
        );
      });
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete ${item.itemname}?`)) {
      fetch(`${process.env.REACT_APP_API_URL}/api/inventory/delete/${item.inventoryid}`, {
        method: 'DELETE'
      }).then(() => {
        setInventory(prev => prev.filter(i => i.inventoryid !== item.inventoryid));
      });
    }
  };

  const handleAdd = () => {
    const name = prompt("Enter new item name:");
    if (name) {
      fetch(`${process.env.REACT_APP_API_URL}/api/inventory/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: name })
      }).then(() => {
        fetchInventory(); //refresh the list after adding
      });
    }
  };

  const generateSalesReport = async () => {
    if (!startDate || !endDate) {
      setReportError("Start and end dates are required");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/sales-report?start=${startDate}&end=${endDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch sales report");

      const data = await response.json();
      setSalesReport(data);
      setReportError(null);
    } catch (err) {
      console.error(err);
      setReportError("Could not generate sales report");
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
            <th>Actions</th>
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
                {item.remaininginstock < 10
                  ? "Low Stock!"
                  : item.remaininginstock < 20
                  ? "Order Soon"
                  : "OK"}
              </td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handleAdd}>Add Item</button>
      </div>

      <div>
        <h2>Sales Report</h2>
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={generateSalesReport} style={{ marginLeft: "10px" }}>
          Generate Report
        </button>
        {reportError && <p style={{ color: "red" }}>{reportError}</p>}

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
                  <td>${parseFloat(entry.totalrevenue).toFixed(2)}</td>
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
