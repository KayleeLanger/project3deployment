import { useEffect, useState } from "react";

function Menu({ setScreen }) {
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newDrink, setNewDrink] = useState({ 
    name: "", 
    price: "", 
    category: "Milk Tea", 
    ingredients: [] 
  });
  const [editDrink, setEditDrink] = useState({ 
    id: null,
    originalName: "",
    name: "", 
    price: "", 
    category: "Milk Tea", 
    ingredients: [] 
  });
  const [drinkIngredients, setDrinkIngredients] = useState({});

  const categoryOptions = [
    "Milk Tea",
    "Brewed Tea",
    "Ice Blended",
    "Fresh Milk",
    "Fruit Tea",
    "Tea Mojito",
    "Seasonal"
  ];

  const fetchCompleteData = async () => {
    setLoading(true);
    try {
      //console.log(`${process.env.REACT_APP_API_URL}/api/drinks`);
      const drinksRes = await fetch(`${process.env.REACT_APP_API_URL}/api/drinks`);
      if (!drinksRes.ok) throw new Error("Failed to fetch drinks");
      const drinksData = await drinksRes.json();

      const inventoryRes = await fetch(`${process.env.REACT_APP_API_URL}/api/invent`);
      if (!inventoryRes.ok) throw new Error("Failed to fetch inventory");
      const inventoryData = await inventoryRes.json();
      setInventory(inventoryData);

      const ingredientsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/drink-ingredients`);
      if (!ingredientsRes.ok) throw new Error("Failed to fetch drink ingredients");
      const ingredientsData = await ingredientsRes.json();
      
      const ingredientsMap = {};
      const drinkIdToName = {};
      
      drinksData.forEach(drink => {
        drinkIdToName[drink.drinkid] = drink.drinkname;
        ingredientsMap[drink.drinkname] = [];
      });
      
      ingredientsData.forEach(item => {
        if (ingredientsMap[item.drinkname]) {
          ingredientsMap[item.drinkname].push(item.inventoryid);
        }
      });
      
      setDrinkIngredients(ingredientsMap);
      setMenu(drinksData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleteData();
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
      fetchCompleteData();
    } catch (err) {
      alert("Error adding drink");
      console.error(err);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editDrink.name || !editDrink.price) return alert("Name and price required");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: editDrink.originalName,
          drinkName: editDrink.name,
          drinkPrice: parseFloat(editDrink.price),
          drinkCategory: editDrink.category,
          inventoryItems: editDrink.ingredients.map(id => ({ inventoryId: id, quantityNeeded: 1 }))
        })
      });

      if (!res.ok) throw new Error("Failed to update drink");
      setShowEditForm(false);
      setEditDrink({ id: null, originalName: "", name: "", price: "", category: "Milk Tea", ingredients: [] });
      fetchCompleteData();
    } catch (err) {
      alert("Error updating drink");
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
      fetchCompleteData();
    } catch (err) {
      alert("Error deleting drink");
      console.error(err);
    }
  };

  const handleEdit = (drink) => {
    setEditDrink({
      id: drink.drinkid,
      originalName: drink.drinkname,
      name: drink.drinkname,
      price: drink.drinkprice,
      category: drink.drinkcategory || "Milk Tea",
      ingredients: drinkIngredients[drink.drinkname] || []
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const getIngredientNames = (drinkName) => {
    if (!drinkIngredients[drinkName] || !drinkIngredients[drinkName].length) {
      return "None";
    }
    
    return drinkIngredients[drinkName]
      .map(id => {
        const ingredient = inventory.find(item => item.inventoryid === id);
        return ingredient ? ingredient.itemname : "Unknown";
      })
      .join(", ");
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="menu-manager">
      <h1>Menu Manager</h1>
      
      <div className="drink-table-container">
        <table className="drink-table">
          <thead>
            <tr>
              <th>Drink Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Ingredients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((drink, i) => (
              <tr key={i}>
                <td>{drink.drinkname}</td>
                <td>${parseFloat(drink.drinkprice).toFixed(2)}</td>
                <td>{drink.drinkcategory || "Uncategorized"}</td>
                <td>{getIngredientNames(drink.drinkname)}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(drink)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(drink.drinkname)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showAddForm && !showEditForm && (
        <div className="action-area">
          <button className="add-button" onClick={() => setShowAddForm(true)}>Add Drink</button>
        </div>
      )}

      {showAddForm && (
        <div className="form-container">
          <h2>Add New Drink</h2>
          <div className="form-group">
            <label>Drink Name:</label>
            <input
              type="text"
              placeholder="Drink Name"
              value={newDrink.name}
              onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newDrink.price}
              onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select 
              value={newDrink.category} 
              onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value })}
            >
              {categoryOptions.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group ingredients-group">
            <label>Ingredients:</label>
            <div className="ingredients-list">
              {inventory.map(item => (
                <div key={item.inventoryid} className="ingredient-checkbox">
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
            </div>
          </div>
          
          <div className="form-buttons">
            <button onClick={handleSubmitAdd} className="save-button">Save</button>
            <button onClick={() => setShowAddForm(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="form-container">
          <h2>Edit Drink</h2>
          <div className="form-group">
            <label>Drink Name:</label>
            <input
              type="text"
              placeholder="Drink Name"
              value={editDrink.name}
              onChange={(e) => setEditDrink({ ...editDrink, name: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={editDrink.price}
              onChange={(e) => setEditDrink({ ...editDrink, price: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select 
              value={editDrink.category} 
              onChange={(e) => setEditDrink({ ...editDrink, category: e.target.value })}
            >
              {categoryOptions.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group ingredients-group">
            <label>Ingredients:</label>
            <div className="ingredients-list">
              {inventory.map(item => (
                <div key={item.inventoryid} className="ingredient-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={editDrink.ingredients.includes(item.inventoryid)}
                      onChange={(e) => {
                        const updatedIngredients = e.target.checked
                          ? [...editDrink.ingredients, item.inventoryid]
                          : editDrink.ingredients.filter(id => id !== item.inventoryid);
                        setEditDrink({ ...editDrink, ingredients: updatedIngredients });
                      }}
                    />
                    {item.itemname}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-buttons">
            <button onClick={handleSubmitEdit} className="save-button">Update</button>
            <button onClick={() => setShowEditForm(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      <div className="navigation">
        <button onClick={() => setScreen("manager")} className="back-button">Back to Manager</button>
      </div>
    </div>
  );
}

export default Menu;