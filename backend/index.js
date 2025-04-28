const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Create express app
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const isRender = process.env.RENDER === "true";
// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
    //ssl: isRender ? { rejectUnauthorized: false } : false
});

process.on('SIGINT', function() {
    pool.end();
    process.exit(0);
});

// inventory
app.get('/api/invent', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory;");
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// x-report
app.get('/api/xreport', async (req, res) => {
    try {
        const query = `
            SELECT EXTRACT(HOUR FROM o.orderDate) AS hour,
            ROUND(SUM(oi.quantity * d.drinkPrice)::numeric, 2) AS total_sales,
            COUNT(o.orderId) AS total_orders,
            COUNT(DISTINCT o.employeeId) AS total_employees,
            SUM(oi.quantity) AS total_items,
            COUNT(CASE WHEN o.orderId % 2 != 0 THEN 1 END) AS apple_pay_count,
            COUNT(CASE WHEN o.orderId % 2 = 0 THEN 1 END) AS card_count
            FROM orders o
            JOIN order_items oi ON o.orderId = oi.orderId
            JOIN drink d ON oi.drinkId = d.drinkId
            WHERE o.orderDate::DATE = '2024-03-05'
            AND EXTRACT(HOUR FROM o.orderDate) < EXTRACT(HOUR FROM CURRENT_TIMESTAMP)
            GROUP BY hour
            ORDER BY hour;
        `;
        //change to current hour possibly?
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('X-Report Database error:', err);
        res.status(500).json({ error: 'Failed to get X-Report: ' + err.message });
    }
});

// z-report
app.get('/api/zreport', async (req, res) => {
    try {
        const query = `
            SELECT 
                ROUND(SUM(oi.quantity * d.drinkPrice)::numeric, 2) AS total_sales, 
                COUNT(o.orderId) AS total_orders, 
                COUNT(DISTINCT o.employeeId) AS total_employees, 
                SUM(oi.quantity) AS total_items, 
                COUNT(CASE WHEN o.orderId % 2 != 0 THEN 1 END) AS apple_pay_count, 
                COUNT(CASE WHEN o.orderId % 2 = 0 THEN 1 END) AS card_count 
            FROM orders o 
            JOIN order_items oi ON o.orderId = oi.orderId 
            JOIN drink d ON oi.drinkId = d.drinkId 
            WHERE o.orderDate::DATE = '2024-03-05';
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Z-Report Database error:', err);
        res.status(500).json({ error: 'Failed to get Z-Report: ' + err.message });
    }
});

//sales report by date range
app.get('/api/sales-report', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const query = `
        SELECT 
            drink.drinkName, 
            SUM(order_items.quantity) AS totalSold, 
            SUM(order_items.quantity * drink.drinkPrice) AS totalRevenue
        FROM order_items
        JOIN drink ON order_items.drinkId = drink.drinkId
        JOIN orders ON order_items.orderId = orders.orderId
        WHERE orders.orderDate BETWEEN $1 AND $2
        GROUP BY drink.drinkName
        ORDER BY totalSold DESC;
    `;

    try {
        const result = await pool.query(query, [start, end]);
        res.json(result.rows);
    } catch (err) {
        console.error('Sales Report Database error:', err);
        res.status(500).json({ error: 'Failed to generate sales report: ' + err.message });
    }
});

//prices
app.get('/api/prices', async (req, res) => {
	try {
		const result = await pool.query('SELECT drinkId, drinkName, drinkPrice FROM drink ORDER BY drinkName;');
		res.json(result.rows);
	} catch (err) {
		console.error('Prices DB error:', err);
		res.status(500).json({ error: 'Failed to load drink prices: ' + err.message });
	}
});

//inventory
app.post('/api/inventory/update', async (req, res) => {
	const { inventoryId, newQuantity } = req.body;
	if (!inventoryId || newQuantity == null) {
		return res.status(400).json({ error: 'Missing inventoryId or newQuantity' });
	}
	try {
		await pool.query(
			`UPDATE inventory SET remainingInStock = $1 WHERE inventoryId = $2`,
			[newQuantity, inventoryId]
		);
		res.json({ message: 'Inventory updated' });
	} catch (err) {
		console.error('Inventory update error:', err);
		res.status(500).json({ error: 'Failed to update inventory' });
	}
});


app.post('/api/inventory/add', async (req, res) => {
	const { itemName } = req.body;
	if (!itemName) return res.status(400).json({ error: "Item name required" });

	const query = `
		WITH max_id AS (
			SELECT COALESCE(MAX(inventoryId), 0) + 1 AS next_id FROM inventory
		)
		INSERT INTO inventory (inventoryId, itemName, soldForDay, remainingInStock)
		SELECT next_id, $1, 0, 0 FROM max_id;
	`;

	try {
		await pool.query(query, [itemName]);
		res.json({ message: "Item added" });
	} catch (err) {
		console.error('Add error:', err);
		res.status(500).json({ error: "Failed to add item" });
	}
});

app.delete('/api/inventory/delete/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query('DELETE FROM inventory WHERE inventoryId = $1', [id]);
		res.json({ message: 'Item deleted' });
	} catch (err) {
		console.error('Delete error:', err);
		res.status(500).json({ error: 'Failed to delete item' });
	}
});

app.post('/api/prices/update', async (req, res) => {
	const { drinkName, newPrice } = req.body;

	if (!drinkName || newPrice == null) {
		return res.status(400).json({ error: 'Missing drinkName or newPrice' });
	}

	try {
		await pool.query(
			`UPDATE drink SET drinkPrice = $1 WHERE drinkName = $2`,
			[newPrice, drinkName]
		);
		res.json({ message: 'Price updated' });
	} catch (err) {
		console.error('Price update error:', err);
		res.status(500).json({ error: 'Failed to update price' });
	}
});

app.post('/api/menu/add', async (req, res) => {
    const { drinkName, drinkPrice, drinkCategory = 'Uncategorized', inventoryItems = [] } = req.body;

    if (!drinkName || drinkPrice == null) {
        return res.status(400).json({ error: "Missing drinkName or drinkPrice" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); //Start transaction

        //Get next drinkId
        const idResult = await client.query('SELECT COALESCE(MAX(drinkId), 0) + 1 AS next_id FROM drink');
        const nextDrinkId = idResult.rows[0].next_id;

        //Insert into drink table
        await client.query(
            `INSERT INTO drink (drinkId, drinkName, drinkPrice, drinkCategory) VALUES ($1, $2, $3, $4)`,
            [nextDrinkId, drinkName, drinkPrice, drinkCategory]
        );

        //Insert into drink_to_inventory table if ingredients are provided
        for (const item of inventoryItems) {
            const { inventoryId, quantityNeeded } = item;
        
            if (!inventoryId) {
                console.error("Missing inventoryId for item:", item);
                continue;
            }
        
            await client.query(
                `INSERT INTO drink_to_inventory (drinkId, inventoryId, quantityNeeded) 
                 VALUES ($1, $2, $3)`,
                [nextDrinkId, inventoryId, quantityNeeded || 1]
            );
        }
        

        await client.query('COMMIT'); //Everything succeeded
        res.json({ message: "Drink and ingredients added successfully" });
    } catch (err) {
        await client.query('ROLLBACK'); //Error, undo everything
        console.error("Add drink error:", err);
        res.status(500).json({ error: "Failed to add drink" });
    } finally {
        client.release();
    }
});


app.delete('/api/menu/delete/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const result = await pool.query('DELETE FROM drink WHERE drinkName = $1', [name]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        res.json({ message: "Drink deleted" });
    } catch (err) {
        console.error("Delete drink error:", err);
        res.status(500).json({ error: "Failed to delete drink" });
    }
});

app.get('/api/inventory-usage', async (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const query = `
        SELECT 
            (SELECT SUM(oi.quantity) 
             FROM order_items oi 
             JOIN orders o ON oi.orderId = o.orderId 
             WHERE o.orderDate BETWEEN $1 AND $2) AS used,
            (SELECT SUM(remainingInStock) 
             FROM inventory) AS instock;
    `;

    try {
        const result = await pool.query(query, [start, end]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Inventory usage query error:', err);
        res.status(500).json({ error: 'Failed to get inventory usage data' });
    }
});


//get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query("SELECT employeeName, employeeRole FROM employee;");
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

//add a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { employeeName, employeeRole = 'Cashier' } = req.body;
        if (!employeeName) {
            return res.status(400).json({ error: 'Employee name is required' });
        }
        
        //based on the query from queries.txt
        const query = `
            WITH max_id AS (
                SELECT COALESCE(MAX(employeeId), 0) + 1 AS next_employee_id 
                FROM employee
            )
            INSERT INTO employee (employeeId, employeeName, employeeRole)
            SELECT next_employee_id, $1, $2
            FROM max_id
            RETURNING *;
        `;
        
        const result = await pool.query(query, [employeeName, employeeRole]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

//delete an employee
app.delete('/api/employees/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const query = 'DELETE FROM employee WHERE employeeName = $1 RETURNING *;';
        const result = await pool.query(query, [name]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// get drinks details for category
app.get('/api/drinks/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        let result;
        if (category == "Toppings") {
            const query = "SELECT otherName, otherPrice FROM toppings_other WHERE otherType = 'topping';";
            result = await pool.query(query);
        }
        else if (category == "Miscellaneous") {
            const query = "SELECT otherName, otherPrice FROM toppings_other WHERE otherType = 'other';";
            result = await pool.query(query);
        }
        else {
            const query = 'SELECT drinkName , drinkPrice FROM drink WHERE drinkCategory = $1;';
            result = await pool.query(query, [category]);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No drinks found for this category'});
        }

        res.json(result.rows); // return list of drinks in category
    } catch (err) {
        console.error('Database error: ' , err);
        res.status(500).json({error: 'Database error: ' + err.message});
    }
});

// get latest orderId
app.get('/api/latest-orderid', async (req, res) => {
    try {
        const result = await pool.query('SELECT MAX(orderId) AS orderId FROM orders;');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Latest orderId error:', err);
        res.status(500).json({ error: 'Failed to get latest orderId' });
    }
});

//Push order to database and update inventory
app.post('/api/checkout', async (req, res) => {
    const client = await pool.connect();
    try {
        const { orderDetails, orderTotal, orderDate, employeeId } = req.body;

        //Get next orderId
        const idResult = await client.query('SELECT COALESCE(MAX(orderId), 0) + 1 AS next_order_id FROM orders');
        const nextOrderId = idResult.rows[0].next_order_id;

        await client.query('BEGIN'); //Start transaction

        //Insert into orders table
        await client.query(
            `INSERT INTO orders (orderId, numItems, orderPrice, orderDate, employeeId)
             VALUES ($1, $2, $3, $4, $5);`,
            [nextOrderId, orderDetails.length, parseFloat(orderTotal), orderDate, parseInt(employeeId)]
        );

        //Insert into order_items and update inventory
        for (const item of orderDetails) {
            const { drinkId = 0, otherId = 0, quantity = 1 } = item;

            //Insert into order_items
            const orderItemIdResult = await client.query('SELECT COALESCE(MAX(order_item_id), 0) + 1 AS next_item_id FROM order_items');
            const nextOrderItemId = orderItemIdResult.rows[0].next_item_id;

            await client.query(
                `INSERT INTO order_items (order_item_id, orderId, drinkId, otherId, quantity)
                 VALUES ($1, $2, $3, $4, $5);`,
                [nextOrderItemId, nextOrderId, drinkId, otherId, quantity]
            );

            if (drinkId !== null) { 
                const ingredientsResult = await client.query(
                    `SELECT inventoryId, quantityNeeded FROM drink_to_inventory WHERE drinkId = $1;`,
                    [drinkId]
                );
                for (const ingredient of ingredientsResult.rows) {
                    const inventoryId = ingredient.inventoryid;
                    const quantityNeeded = ingredient.quantityneeded;
                    await client.query(
                        `UPDATE inventory SET remainingInStock = remainingInStock - $1 WHERE inventoryId = $2;`,
                        [quantity * quantityNeeded, inventoryId]
                    );
                }
            }              

            if (otherId !== 0) {
                const toppingResult = await client.query(
                    `SELECT otherName FROM toppings_other WHERE otherId = $1;`,
                    [otherId]
                );

                const toppingName = toppingResult.rows[0]?.othername;

                if (toppingName) {
                    const inventoryResult = await client.query(
                        `SELECT inventoryId FROM inventory WHERE itemName = $1;`,
                        [toppingName]
                    );

                    if (inventoryResult.rows.length > 0) {
                        const inventoryId = inventoryResult.rows[0].inventoryid;

                        await client.query(
                            `UPDATE inventory SET remainingInStock = remainingInStock - $1 WHERE inventoryId = $2;`,
                            [quantity, inventoryId]
                        );
                    }
                }
            }
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Order successfully placed and inventory updated!' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Checkout error:', err.message);
        res.status(500).json({ error: 'Checkout failed: ' + err.message });
    } finally {
        client.release();
    }
});

//get drinkId from drink name
app.get('/api/drinks/id/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query('SELECT drinkId FROM drink WHERE drinkName = $1', [name]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Drink not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

//get otherId from misc item name
app.get('/api/misc/id/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query('SELECT otherId FROM toppings_other WHERE otherName = $1', [name]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Misc item not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});



//push order_items individually (if needed separately)
app.post('/api/orderitem', async (req, res) => {
    const { orderId, drinkName, otherName, quantity } = req.body;

    try {
        let drinkId = null;
        let otherId = null;

        if (drinkName) {
            const drinkRes = await pool.query('SELECT drinkId FROM drink WHERE drinkName = $1', [drinkName]);
            if (drinkRes.rows.length > 0) drinkId = drinkRes.rows[0].drinkid;
        }

        if (otherName) {
            const otherRes = await pool.query('SELECT otherId FROM toppings_other WHERE otherName = $1', [otherName]);
            if (otherRes.rows.length > 0) otherId = otherRes.rows[0].otherid;
        }

        await pool.query(`
            INSERT INTO order_items (order_item_id, orderId, drinkId, otherId, quantity)
            VALUES (DEFAULT, $1, $2, $3, $4)
        `, [orderId, drinkId, otherId, quantity]);

        res.status(201).json({ message: "Order item added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add order item" });
    }
});



//get all toppings directly (used by CustomerToppingsScreen) -Long
app.get('/api/toppings', async (req, res) => {
    try {
        const query = "SELECT otherName, otherPrice, otherType FROM toppings_other WHERE otherType = 'topping';";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Toppings fetch error:', err);
        res.status(500).json({ error: 'Failed to load toppings: ' + err.message });
    }
});



app.get('/api/drinks', async (req, res) => {
    try {
        const query = `
            SELECT drinkId, drinkName, drinkPrice, drinkCategory 
            FROM drink 
            ORDER BY drinkName;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Drinks fetch error:', err);
        res.status(500).json({ error: 'Failed to load drinks: ' + err.message });
    }
});

// Update an existing drink
app.put('/api/menu/update', async (req, res) => {
    const { originalName, drinkName, drinkPrice, drinkCategory = 'Uncategorized', inventoryItems = [] } = req.body;

    if (!originalName || !drinkName || drinkPrice == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Get the drinkId for original drink name
        const drinkIdResult = await client.query('SELECT drinkId FROM drink WHERE drinkName = $1', [originalName]);
        
        if (drinkIdResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Drink not found" });
        }
        
        const drinkId = drinkIdResult.rows[0].drinkid;

        // Update drink details
        await client.query(
            `UPDATE drink 
             SET drinkName = $1, drinkPrice = $2, drinkCategory = $3 
             WHERE drinkId = $4`,
            [drinkName, drinkPrice, drinkCategory, drinkId]
        );

        // Delete existing drink-to-inventory relationships
        await client.query('DELETE FROM drink_to_inventory WHERE drinkId = $1', [drinkId]);

        // Insert new drink-to-inventory relationships
        for (const item of inventoryItems) {
            const { inventoryId, quantityNeeded } = item;
        
            if (!inventoryId) {
                console.error("Missing inventoryId for item:", item);
                continue;
            }
        
            await client.query(
                `INSERT INTO drink_to_inventory (drinkId, inventoryId, quantityNeeded) 
                 VALUES ($1, $2, $3)`,
                [nextDrinkId, inventoryId, quantityNeeded || 1]
            );
        }
        

        await client.query('COMMIT');
        res.json({ message: "Drink updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Update drink error:", err);
        res.status(500).json({ error: "Failed to update drink" });
    } finally {
        client.release();
    }
});

// Get drink names + their inventory IDs
app.get('/api/drink-ingredients', async (req, res) => {
    try {
        const query = `
            SELECT d.drinkName, dti.inventoryId
            FROM drink d
            JOIN drink_to_inventory dti ON d.drinkId = dti.drinkId
            ORDER BY d.drinkName;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Drink ingredients fetch error:', err);
        res.status(500).json({ error: 'Failed to load drink ingredients: ' + err.message });
    }
});

//start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



