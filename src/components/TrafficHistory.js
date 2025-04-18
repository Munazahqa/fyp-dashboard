import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TrafficHistory() {
    const [trafficData, setTrafficData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeValue, setTimeValue] = useState('1');
    const [timeUnit, setTimeUnit] = useState('hours');

    // Fetch and process the data
    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                const response = await fetch('/30_day_traffic.csv');
                const csvText = await response.text();
                
                Papa.parse(csvText, {
                    header: true,
                    complete: (results) => {
                        // Process and format the data
                        const processedData = results.data
                            .filter(item => item.timestamp && item.http_requests)
                            .map(item => ({
                                timestamp: new Date(item.timestamp),
                                volume: parseFloat(item.http_requests)
                            }))
                            .sort((a, b) => a.timestamp - b.timestamp);
                        
                        setTrafficData(processedData);
                        setLoading(false);
                    },
                    error: (error) => {
                        setError(error.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError('Failed to fetch traffic data');
                setLoading(false);
            }
        };

        fetchTrafficData();
    }, []);

    // Filter the data based on timeValue and timeUnit
    useEffect(() => {
        if (trafficData.length > 0) {
            const now = new Date();
            let timeInMilliseconds;
            
            if (timeUnit === 'hours') {
                timeInMilliseconds = parseFloat(timeValue) * 60 * 60 * 1000;
            } else {
                timeInMilliseconds = parseFloat(timeValue) * 24 * 60 * 60 * 1000;
            }
            
            const timeAgo = new Date(now.getTime() - timeInMilliseconds);
            
            const filtered = trafficData.filter(item => 
                item.timestamp >= timeAgo && item.timestamp <= now
            );
            
            setFilteredData(filtered);
        }
    }, [timeValue, timeUnit, trafficData]);

    const handleTimeValueChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setTimeValue(value);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <div className="spinner-border text-purple" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    // Prepare data for the chart
    const chartData = {
        labels: filteredData.map(item => item.timestamp.toLocaleString()),
        datasets: [
            {
                label: 'Traffic Volume',
                data: filteredData.map(item => item.volume),
                borderColor: '#8a2be2',
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#8a2be2',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#8a2be2',
                pointHoverBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 // Disable animations to prevent continuous movement
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    font: {
                        size: 13
                    }
                }
            },
            title: {
                display: true,
                text: 'Traffic Volume Over Time',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#8a2be2',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `Volume: ${context.parsed.y.toFixed(2)}`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 11
                    }
                },
                title: {
                    display: true,
                    text: 'Time',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                title: {
                    display: true,
                    text: 'Traffic Volume',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                        size: 11
                    },
                    callback: (value) => value.toFixed(2)
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="h-100 p-3">
            <div className="d-flex justify-content-end mb-3 align-items-center">
                <div className="input-group" style={{ width: '200px' }}>
                    <input
                        type="text"
                        className="form-control border-purple"
                        value={timeValue}
                        onChange={handleTimeValueChange}
                        placeholder="Enter time value"
                    />
                    <select 
                        className="form-select border-purple" 
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                        style={{ width: '80px' }}
                    >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                    </select>
                </div>
            </div>
            <div style={{ height: '500px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

export default TrafficHistory; 