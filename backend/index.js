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

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
