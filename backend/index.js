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


// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query("SELECT employeeName, employeeRole FROM employee;");
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { employeeName, employeeRole = 'Cashier' } = req.body;
        if (!employeeName) {
            return res.status(400).json({ error: 'Employee name is required' });
        }
        
        // Based on the query from queries.txt
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

// Delete an employee
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

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
