import { useState, useEffect } from "react";

function Employees({ setScreen }) { //employees
    const [employees, setEmployees] = useState([]);
    const [newEmployeeName, setNewEmployeeName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`);
            if (!response.ok) throw new Error("Failed to get employees");
            
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching employees:", err);
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (e, role = 'Cashier') => {
        e.preventDefault();
        if (!newEmployeeName.trim()) {
            setError("Employee name is required");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    employeeName: newEmployeeName,
                    employeeRole: role
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add employee");
            }

            //reset form/update employee list
            setNewEmployeeName("");
            fetchEmployees();
        } catch (err) {
            setError(err.message);
            console.error("Error adding employee:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (employeeName) => {
        const confirmed = window.confirm(`Are you sure you want to delete ${employeeName}?`);
        if (!confirmed) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees/${employeeName}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete employee");
            }

            //refresh employee list
            fetchEmployees();
        } catch (err) {
            setError(err.message);
            console.error("Error deleting employee:", err);
        } finally {
            setLoading(false);
        }
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
            backgroundColor: 'white',
            color: 'black'
        }}>
            {/*Sidebar*/}
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
            
            {/*Main Content*/}
            <div style={{ 
                flex: 1,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h1 style={{ marginBottom: '20px' }}>Employee Management</h1>
                
                {/*Add Employee Form*/}
                <div style={{ marginBottom: '30px' }}>
                    <h2>Add New Employee</h2>
                    <form onSubmit={(e) => addEmployee(e, 'Cashier')}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={newEmployeeName}
                                onChange={(e) => setNewEmployeeName(e.target.value)}
                                placeholder="Employee Name"
                                style={{
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    flex: 1
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Cashier
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={(e) => addEmployee(e, 'Manager')}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Manager
                            </button>
                        </div>
                    </form>
                </div>
                
                {loading && <div style={{ margin: '20px 0' }}>Loading...</div>}
                {error && <div style={{ color: "red", margin: '20px 0' }}>Error: {error}</div>}
                
                {/* Employee List */}
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
                        Employee Directory
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
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Role</th>
                                    <th style={tableHeaderStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((employee, index) => (
                                        <tr key={index} style={{ 
                                            borderBottom: '1px solid'
                                        }}>
                                            <td style={tableCellStyle}>{employee.employeename}</td>
                                            <td style={tableCellStyle}>{employee.employeerole}</td>
                                            <td style={tableCellStyle}>
                                                <button
                                                    onClick={() => deleteEmployee(employee.employeename)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ 
                                            textAlign: 'center', 
                                            padding: '20px',
                                        }}>
                                            No employees found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid',
    color: 'black'
};

const tableCellStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid',
    color: 'black'
};

export default Employees;