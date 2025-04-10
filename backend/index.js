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
		const result = await pool.query('SELECT drinkName, drinkPrice FROM drink ORDER BY drinkName;');
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
    const { drinkName, drinkPrice, drinkCategory = 'Uncategorized' } = req.body;

    if (!drinkName || drinkPrice == null) {
        return res.status(400).json({ error: "Missing drinkName or drinkPrice" });
    }

    try {
        //get next available drinkId
        const idResult = await pool.query('SELECT COALESCE(MAX(drinkId), 0) + 1 AS next_id FROM drink');
        const nextId = idResult.rows[0].next_id;

        //insert into drink table
        const insertQuery = `
            INSERT INTO drink (drinkId, drinkName, drinkPrice, drinkCategory)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(insertQuery, [nextId, drinkName, drinkPrice, drinkCategory]);

        res.json({ message: "Drink added" });
    } catch (err) {
        console.error("Add drink error:", err);
        res.status(500).json({ error: "Failed to add drink" });
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

        if (category == "Miscellaneous") {
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

// push order to database
app.post('/api/checkout', async (req, res) => {
    try {
        const { numItems, orderTotal, orderDate, employeeId } = req.body;
        console.log('Received data: ', req.body);

        // get next orderId
        const id = await pool.query('SELECT COALESCE(MAX(orderId), 0) + 1 AS next_order_id FROM orders');
        const nextId = id.rows[0].next_order_id;

        // insert into order table
        const query = `
                    INSERT INTO orders (orderId, numItems, orderPrice, orderDate, employeeId)
                    VALUES ($1, $2, $3, $4, $5);`;

        const result = await pool.query(query, [parseInt(nextId), parseInt(numItems), parseFloat(orderTotal), orderDate, parseInt(employeeId)]);

        console.log("Order placed successfully");
        res.status(200).json({message: 'Order successfully placed', result});
    } catch (err) {
        console.log('Database error: ' , err.message);
        res.status(500).json({error: 'Database error: ' + err.message});
    }
});

// get toppings
// app.get('/api/toppings', async (req, res) => {
//     try {
//         const query = 'SELECT otherName , otherPrice FROM toppings_other;';
//         const result = await pool.query(query);

//         if (result.rows.length === 0) {
//             return res.status(404).json({error: 'No toppings found'});
//         }

//         res.json(result.rows); // return list of toppings
//     } catch (err) {
//         console.error('Database error: ' , err);
//         res.status(500).json({error: 'Database error: ' + err.message});
//     }
// });

//start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});