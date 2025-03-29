import { useEffect, useState } from "react";

function Menu({ setScreen }) { //menu
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/prices`);
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAdd = async () => {
    const name = prompt("Enter drink name:");
    const price = prompt("Enter drink price:");
    if (!name || !price) return alert("Name and price required");

    const category = prompt("Enter drink category:", "Milk Tea");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drinkName: name, drinkPrice: parseFloat(price), drinkCategory: category })
      });

      if (!res.ok) throw new Error("Failed to add drink");
      fetchMenu(); //refresh list
    } catch (err) {
      alert("Error adding drink");
      console.error(err);
    }
  };

  const handleDelete = async (drinkName) => {
    const confirmed = window.confirm(`Delete ${drinkName}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/delete/${drinkName}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete drink");
      fetchMenu(); //refresh list
    } catch (err) {
      alert("Error deleting drink");
      console.error(err);
    }
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Menu Manager</h1>
      <table>
        <thead>
          <tr>
            <th>Drink Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((drink, i) => (
            <tr key={i}>
              <td>{drink.drinkname}</td>
              <td>${parseFloat(drink.drinkprice).toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(drink.drinkname)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAdd}>Add Drink</button>
      <br />
      <button onClick={() => setScreen("manager")}>Back to Manager</button>
    </div>
  );
}

export default Menu;
