"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statusData = [
  { name: 'Active', value: 12, color: '#10B981' },
  { name: 'At Risk', value: 1, color: '#F59E0B' },
  { name: 'Ghosting', value: 30, color: '#EF4444' },
  { name: 'Archived', value: 11, color: '#6B7280' },
];

const ghostingTimeline = [
  { range: '14-30 days', count: 8 },
  { range: '30-60 days', count: 5 },
  { range: '60-90 days', count: 4 },
  { range: '90-120 days', count: 3 },
  { range: '120+ days', count: 10 },
];

const adherenceRanges = [
  { range: '90-100%', count: 8, label: 'Excellent' },
  { range: '70-89%', count: 3, label: 'Good' },
  { range: '50-69%', count: 2, label: 'Fair' },
  { range: 'Below 50%', count: 41, label: 'Poor' },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics & Insights
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Deep dive into client adherence patterns and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">22%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall Adherence</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">56%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ghosting Rate</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">159</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max Days Ghosting</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">33%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Need Attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Client Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ghosting Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Ghosting Timeline Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ghostingTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Adherence Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Adherence Level Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {adherenceRanges.map((range) => (
            <div key={range.range} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{range.count}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{range.range}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{range.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Insights */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-900 dark:text-red-400 mb-3">
          ⚠️ Critical Insights
        </h3>
        <ul className="space-y-2 text-red-800 dark:text-red-300">
          <li>• 56% of clients are ghosting (30 out of 54)</li>
          <li>• 33% need immediate attention (18 clients ghosting &gt;14 days)</li>
          <li>• Only 22% are actively engaged</li>
          <li>• 10 clients have been ghosting for over 120 days</li>
          <li>• Re-engagement campaign urgently needed</li>
        </ul>
      </div>
    </div>
  );
}
