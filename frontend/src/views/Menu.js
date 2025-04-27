import { useEffect, useState } from "react";

function Menu({ setScreen }) {
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDrink, setNewDrink] = useState({ name: "", price: "", category: "Milk Tea", ingredients: [] });

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

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/invent`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchInventory();
  }, []);

  const handleSubmitAdd = async () => {
    if (!newDrink.name || !newDrink.price) return alert("Name and price required");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drinkName: newDrink.name,
          drinkPrice: parseFloat(newDrink.price),
          drinkCategory: newDrink.category,
          inventoryItems: newDrink.ingredients.map(id => ({ inventoryId: id, quantityNeeded: 1 }))
        })
      });

      if (!res.ok) throw new Error("Failed to add drink");
      setShowAddForm(false);
      setNewDrink({ name: "", price: "", category: "Milk Tea", ingredients: [] });
      fetchMenu();
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
      fetchMenu();
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

      {showAddForm ? (
        <div style={{ marginTop: "20px" }}>
          <h2>Add New Drink</h2>
          <input
            type="text"
            placeholder="Drink Name"
            value={newDrink.name}
            onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
          /><br />
          <input
            type="number"
            placeholder="Price"
            value={newDrink.price}
            onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
          /><br />
          <select value={newDrink.category} onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value })}>
            <option>Milk Tea</option>
            <option>Brewed Tea</option>
            <option>Ice Blended</option>
            <option>Fresh Milk</option>
            <option>Fruit Tea</option>
            <option>Tea Mojito</option>
            <option>Seasonal</option>
          </select><br />
          <h3>Select Ingredients</h3>
          {inventory.map(item => (
            <div key={item.inventoryid}>
              <label>
                <input
                  type="checkbox"
                  checked={newDrink.ingredients.includes(item.inventoryid)}
                  onChange={(e) => {
                    const updatedIngredients = e.target.checked
                      ? [...newDrink.ingredients, item.inventoryid]
                      : newDrink.ingredients.filter(id => id !== item.inventoryid);
                    setNewDrink({ ...newDrink, ingredients: updatedIngredients });
                  }}
                />
                {item.itemname}
              </label>
            </div>
          ))}
          <button onClick={handleSubmitAdd}>Save</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)}>Add Drink</button>
      )}

      <br />
      <button onClick={() => setScreen("manager")}>Back to Manager</button>
    </div>
  );
}

export default Menu;
