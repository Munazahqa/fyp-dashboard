import React from 'react';
import { useLocation } from 'react-router-dom';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

function MainContent() {
  const location = useLocation();
  
  // Helper function to get the title based on current path
  const getTitle = (path) => {
    switch(path) {
      case '/':
        return 'Dashboard';
      case '/nodes':
        return 'Nodes';
      case '/pods':
        return 'Pods';
      case '/history':
        return 'History';
      case '/settings':
        return 'Settings';
      case '/logout':
        return 'Logout';
      default:
        return 'Dashboard';
    }
  };

  // const data = {
  //   labels: Array.from({ length: 20 }, (_, i) => i),
  //   datasets: [
  //     {
  //       label: 'CPU Usage (%)',
  //       data: [35, 95, 95, 30, 15, 35, 95, 85, 20, 95, 35, 15, 35, 15, 8, 35, 60, 75],
  //       borderColor: 'rgb(53, 162, 235)',
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //     {
  //       label: 'Memory Usage (%)',
  //       data: [55, 5, 55, 5, 75, 15, 5, 85, 2, 65, 12, 65, 45, 65, 2, 25, 25, 25],
  //       borderColor: 'rgb(75, 192, 192)',
  //       backgroundColor: 'rgba(75, 192, 192, 0.5)',
  //     },
  //   ],
  // };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'CPU and Memory Usage Over Time'
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       max: 100,
  //       title: {
  //         display: true,
  //         text: 'Usage (%)'
  //       }
  //     },
  //     x: {
  //       title: {
  //         display: true,
  //         text: 'Time Steps'
  //       }
  //     }
  //   }
  // };

  return (
    <div className="mx-3 my-1 flex-grow-1 d-flex flex-column" style={{ maxHeight: '85vh' }}>
      <div className="bg-white rounded p-4 shadow-sm flex-grow-1">
        <h3 className="mb-4" style={{ color: '#8a2be2' }}>{getTitle(location.pathname)}</h3>
        <div className="h-100">
          {/* <Line options={options} data={data} /> */}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
