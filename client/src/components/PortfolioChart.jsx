// frontend/src/components/PortfolioChart.jsx

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

export default function PortfolioChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/portfolio-chart')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Chart fetch error:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mutual Fund Portfolio Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={value => `₹${value.toLocaleString()}`} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
