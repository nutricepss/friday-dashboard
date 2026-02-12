import React from 'react';
import { TrendData, DashboardStats } from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartsProps {
  trendData: TrendData[];
  stats: DashboardStats;
}

const Charts: React.FC<ChartsProps> = ({ trendData, stats }) => {
  const statusDistribution = [
    { name: 'Active', value: stats.active, color: '#10b981' },
    { name: 'At Risk', value: stats.atRisk, color: '#f59e0b' },
    { name: 'Ghosting', value: stats.ghosting, color: '#ef4444' },
    { name: 'Expiring', value: stats.expiring, color: '#3b82f6' },
    { name: 'Archived', value: stats.archived, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Adherence Trend (Last 7 Days)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="active"
                name="Active Clients"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="atRisk"
                name="At Risk Clients"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ghosting"
                name="Ghosting Clients"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Client Status Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Clients']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Adherence Rate Chart */}
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Adherence Rate
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { weekday: 'short' });
                }}
              />
              <YAxis 
                stroke="#9ca3af"
                label={{ 
                  value: 'Adherence Rate (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10,
                  style: { fill: '#9ca3af' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Adherence Rate']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar
                dataKey="adherenceRate"
                name="Adherence Rate"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {trendData[trendData.length - 1]?.adherenceRate || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Current Rate
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {Math.max(...trendData.map(d => d.adherenceRate))}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Peak This Week
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {Math.min(...trendData.map(d => d.adherenceRate))}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Low This Week
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {Math.round(trendData.reduce((sum, d) => sum + d.adherenceRate, 0) / trendData.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Weekly Average
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;