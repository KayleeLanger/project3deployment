import { useState, useEffect } from "react";

function OrderTrends({ setScreen }) { //order trends
    const [xReport, setXReport] = useState([]);
    const [zReport, setZReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeReport, setActiveReport] = useState(null);
    const [zReportRan, setZReportRan] = useState(false);

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
            if (zReportRan) {
                // If Z-report was run, show zeroed out results with hour = 0
                const zeroedReport = [{
                    hour: 0,
                    total_sales: 0,
                    total_orders: 0,
                    total_employees: 0,
                    total_items: 0,
                    apple_pay_count: 0,
                    card_count: 0
                }];
                
                setXReport(zeroedReport);
                setActiveReport('x');
                setZReport(null);
                
                alert("Z-report has already been run today. X-Report is reset to zero.");
                return;
            }
    
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
            const openingHour = 9;
            
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

    const fetchZReport = async () => {
        if (zReportRan) {
            alert("Z-report has already been run for today.");
            return;
        }

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
            setZReportRan(true);
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
    
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh',
            backgroundColor: 'white'
        }}>
            {/* Sidebar */}
            <div style={{
                width: '150px',
                backgroundColor: '#D3D3D3',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ 
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatTime(currentTime)}</div>
                    <div style={{ fontSize: '14px' }}>{formatDate(currentTime)}</div>
                </div>
                
                <button
                    onClick={() => setScreen("manager")}
                    style={{
                        marginTop: 'auto',
                        padding: '10px',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Back
                </button>
            </div>
            
            {/* Main Content */}
            <div style={{ 
                flex: 1,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h1 style={{ marginBottom: '20px' }}>Order Trends</h1>
                
                <div style={{ 
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={fetchXReport}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: activeReport === 'x' ? 'green' : '#D3D3D3',
                            color: activeReport === 'x' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        X-Report
                    </button>
                    <button
                        onClick={fetchZReport}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: activeReport === 'z' ? 'green' : '#D3D3D3',
                            color: activeReport === 'z' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Z-Report
                    </button>
                    <button
                        onClick={() => setScreen("graph")}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Product Usage Chart
                    </button>
                    <button
                        onClick={resetReports}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: 'auto'
                        }}
                    >
                        Clear
                    </button>
                </div>
                
                {loading && <div style={{ margin: '20px 0' }}>Loading data...</div>}
                {error && <div style={{ color: "red", margin: '20px 0' }}>Error: {error}</div>}
                
                {/* X-Report Table */}
                {activeReport === 'x' && (
                    <div style={{ 
                        flex: 1,
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <h2 style={{ 
                            padding: '15px',
                            backgroundColor: '#333333',
                            color: 'white',
                            margin: 0
                        }}>
                            X-Report (Updated: {formatTime(currentTime)})
                        </h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ 
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{ 
                                        backgroundColor: '#D3D3D3',
                                        fontWeight: 'bold'
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
                                                borderBottom: '1px solid'
                                            }}>
                                                <td style={tableCellStyle}>{row.hour === 0 ? "0:00" : `${row.hour}:00`}</td>
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
                                                padding: '20px',
                                            }}>
                                                No order data available for today
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* Z-Report */}
                {activeReport === 'z' && zReport && (
                    <div style={{ 
                        flex: 1,
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <h2 style={{ 
                            padding: '15px',
                            backgroundColor: 'grey',
                            color: 'white',
                            margin: 0
                        }}>
                            Z-Report (Updated: {formatTime(currentTime)})
                        </h2>
                        <div style={{ 
                            padding: '20px',
                            backgroundColor: '#D3D3D3'
                        }}>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Total Sales:</span>
                                <span style={zReportValueStyle}>${zReport.total_sales.toFixed(2)}</span>
                            </div>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Total Orders:</span>
                                <span style={zReportValueStyle}>{zReport.total_orders}</span>
                            </div>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Total Employees:</span>
                                <span style={zReportValueStyle}>{zReport.total_employees}</span>
                            </div>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Total Items Sold:</span>
                                <span style={zReportValueStyle}>{zReport.total_items}</span>
                            </div>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Apple Pay Transactions:</span>
                                <span style={zReportValueStyle}>{zReport.apple_pay_count}</span>
                            </div>
                            <div style={zReportItemStyle}>
                                <span style={zReportLabelStyle}>Credit/Debit Transactions:</span>
                                <span style={zReportValueStyle}>{zReport.card_count}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid'
};

const tableCellStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid'
};

const zReportItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
};

const zReportLabelStyle = {
    fontWeight: 'bold',
    color: '#333333'
};

const zReportValueStyle = {
    color: 'black'
};

export default OrderTrends;