import React from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import SideBar from '../Components/SideBar';
import { motion } from 'framer-motion';

// Register the components you need
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


const AnalyticsDashboard = () => {
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Current Period',
        data: [20, 40, 30, 50, 70, 60, 80, 60, 70, 50, 60, 40],
        borderColor: '#00BFFF',
        backgroundColor: 'rgba(0, 191, 255, 0.2)',
        fill: true,
      },
      {
        label: 'Compare',
        data: [10, 30, 20, 40, 60, 50, 70, 50, 60, 40, 50, 30],
        borderColor: '#FF8C00',
        backgroundColor: 'rgba(255, 140, 0, 0.2)',
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['Package 1', 'Package 2', 'Package 3', 'Package 4', 'Package 5'],
    datasets: [
      {
        label: 'Top selling package',
        data: [40, 60, 55, 70, 50],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar></SideBar>
      <motion.div initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }} 
        className="analytics-dashboard mainSec"
        style={{ padding:'1% 0% 0% 3%' }}
        >
        <h1 className="secHead" style={{ padding: '0px 20px', fontSize:'3rem' }}>Analytics</h1>
        <div className="container mainSec chart-container">
          <div className="chart-box">
            <h3>Visits</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Total Sales</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Conversion Rates</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Top Selling Package</h3>
            <Bar data={barChartData} />
          </div>
          <div className="chart-box">
            <h3>Total Orders</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Returning Customers</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Average Order Value</h3>
            <Line data={lineChartData} />
          </div>
          <div className="chart-box">
            <h3>Saled by Marketing</h3>
            <Line data={lineChartData} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
