import { useState, useEffect } from "react";

function OrderTrends({ setScreen }) {
    const [xReport, setXReport] = useState([]);
    const [zReport, setZReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeReport, setActiveReport] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchXReport = async () => {
        setLoading(true);
        setError(null);
        try {
            //const response = await fetch("http://localhost:8080/api/xreport");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/xreport`);
            if (!response.ok) throw new Error("Failed to get X-Report");
           
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Process and validate data
            const processedData = data.map(item => ({
                hour: Number(item.hour) || 0,
                total_sales: Number(item.total_sales) || 0,
                total_orders: Number(item.total_orders) || 0,
                total_employees: Number(item.total_employees) || 0,
                total_items: Number(item.total_items) || 0,
                apple_pay_count: Number(item.apple_pay_count) || 0,
                card_count: Number(item.card_count) || 0
            }));

            const currentHour = currentTime.getHours();
            const openingHour = 9; // TODO: Change to actual opening hour
            
            // Array of all hours opening to current hour
            const hoursInDay = Array.from({length: currentHour - openingHour + 1}, (_, i) => openingHour + i);
            
            // Generate report data with zeros for hours without data
            const completeReport = hoursInDay.map(hour => {
                const hourData = processedData.find(item => item.hour === hour);
                return hourData || {
                    hour,
                    total_sales: 0,
                    total_orders: 0,
                    total_employees: 0,
                    total_items: 0,
                    apple_pay_count: 0,
                    card_count: 0
                };
            });
            
            setXReport(completeReport);
            setActiveReport('x');
            setZReport(null);
        } catch (err) {
            setError(err.message);
            console.error("X-Report Error:", err);
        } finally {
            setLoading(false);
        }
    };
       
    const fetchZReport = async () => { //this needs to include the reset functionality from project 2
        setLoading(true);
        setError(null);
        try {
            //const response = await fetch("http://localhost:8080/api/zreport");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/zreport`);
            if (!response.ok) throw new Error("Failed to get Z-Report");
           
            const data = await response.json();
            if (data.error) throw new Error(data.error);
           
            // Process Z-report data
            const processedData = {
                total_sales: Number(data[0]?.total_sales) || 0,
                total_orders: Number(data[0]?.total_orders) || 0,
                total_employees: Number(data[0]?.total_employees) || 0,
                total_items: Number(data[0]?.total_items) || 0,
                apple_pay_count: Number(data[0]?.apple_pay_count) || 0,
                card_count: Number(data[0]?.card_count) || 0
            };

            setZReport(processedData);
            setActiveReport('z');
            setXReport([]);
        } catch (err) {
            setError(err.message);
            console.error("Z-Report Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetReports = () => {
        setXReport([]);
        setZReport(null);
        setActiveReport(null);
        setError(null);
    };
   
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Order Trends</h1>
            <div>
                <h3>{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</h3>
            </div>
   
            <div style={{ margin: '20px 0' }}>
                <button
                    onClick={fetchXReport}
                    disabled={loading}
                    style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: activeReport === 'x' ? 'green' : '#D3D3D3',
                        color: activeReport === 'x' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Generate X-Report
                </button>
                <button
                    onClick={fetchZReport}
                    disabled={loading}
                    style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: activeReport === 'z' ? 'green' : '#D3D3D3',
                        color: activeReport === 'z' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Generate Z-Report
                </button>
                <button
                    onClick={resetReports}
                    style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Reports
                </button>
                <button
                    onClick={() => setScreen("manager")}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Manager
                </button>
            </div>
               
            {loading && <p>Loading data...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
   
            {/* X-Report Table */}
            {activeReport === 'x' && (
                <div style={{ marginTop: '30px' }}>
                    <h2>X-Report (Updated: {currentTime.toLocaleTimeString()})</h2>
                    <table style={{ 
                        borderCollapse: 'collapse', 
                        width: '100%',
                        border: '1px solid',
                    }}>
                        <thead>
                            <tr style={{ 
                                backgroundColor: 'grey',
                                color: 'white'
                            }}>
                                <th style={tableHeaderStyle}>Hour</th>
                                <th style={tableHeaderStyle}>Employees</th>
                                <th style={tableHeaderStyle}>Orders</th>
                                <th style={tableHeaderStyle}>Items Sold</th>
                                <th style={tableHeaderStyle}>Total Sales ($)</th>
                                <th style={tableHeaderStyle}>Apple Pay</th>
                                <th style={tableHeaderStyle}>Credit/Debit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {xReport.length > 0 ? (
                                xReport.map((row, index) => (
                                    <tr key={index} style={{ 
                                        borderBottom: '1px solid',
                                        backgroundColor: 'white'
                                    }}>
                                        <td style={tableCellStyle}>{row.hour}:00</td>
                                        <td style={tableCellStyle}>{row.total_employees}</td>
                                        <td style={tableCellStyle}>{row.total_orders}</td>
                                        <td style={tableCellStyle}>{row.total_items}</td>
                                        <td style={tableCellStyle}>${row.total_sales.toFixed(2)}</td>
                                        <td style={tableCellStyle}>{row.apple_pay_count}</td>
                                        <td style={tableCellStyle}>{row.card_count}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ 
                                        textAlign: 'center', 
                                        padding: '12px',
                                        color: 'grey'
                                    }}>
                                        No order data available for today
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
   
            {/* Z-Report */}
            {activeReport === 'z' && zReport && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Z-Report (Updated: {currentTime.toLocaleTimeString()})</h2>
                    <div style={{ 
                        backgroundColor: 'grey', 
                        padding: '20px', 
                        color: 'white',
                    }}>
                        <p style={zReportStyle}><strong>Total Sales:</strong> ${zReport.total_sales.toFixed(2)}</p>
                        <p style={zReportStyle}><strong>Total Orders:</strong> {zReport.total_orders}</p>
                        <p style={zReportStyle}><strong>Total Employees:</strong> {zReport.total_employees}</p>
                        <p style={zReportStyle}><strong>Total Items Sold:</strong> {zReport.total_items}</p>
                        <p style={zReportStyle}><strong>Apple Pay Transactions:</strong> {zReport.apple_pay_count}</p>
                        <p style={zReportStyle}><strong>Credit/Debit Transactions:</strong> {zReport.card_count}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'center',
};

const tableCellStyle = {
    padding: '12px',
    textAlign: 'center',
};

const zReportStyle = {
    margin: '10px 0',
    fontSize: '16px',
};

export default OrderTrends;