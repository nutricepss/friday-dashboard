"use client";

import { useState } from 'react';

interface Client {
  id: number;
  name: string;
  status: string;
  adherence: number;
  lastCheckin: string;
  daysSince: number;
  program: string;
}

const clients: Client[] = [
  // Active Clients (12 total) - REAL DATA from HubFit
  { id: 43, name: "Udit Saxena", status: "Active", adherence: 85, lastCheckin: "08 Feb 2026", daysSince: 3, program: "General Fitness" },
  { id: 44, name: "Aditi Bathwal", status: "Active", adherence: 90, lastCheckin: "09 Feb 2026", daysSince: 2, program: "Weight Loss" },
  { id: 45, name: "Mahendra Reddy", status: "Active", adherence: 95, lastCheckin: "10 Feb 2026", daysSince: 1, program: "Muscle Gain" },
  { id: 46, name: "Apurv Jain", status: "Active", adherence: 92, lastCheckin: "10 Feb 2026", daysSince: 1, program: "Strength" },
  { id: 47, name: "Sweta Sen", status: "Active", adherence: 88, lastCheckin: "10 Feb 2026", daysSince: 1, program: "Cardio" },
  { id: 48, name: "Khushi Jain", status: "Active", adherence: 94, lastCheckin: "09 Feb 2026", daysSince: 1, program: "General Fitness" },
  { id: 49, name: "Shivangi Bhaskar", status: "Active", adherence: 96, lastCheckin: "11 Feb 2026", daysSince: 0, program: "HIIT" },
  { id: 50, name: "Nithya", status: "Active", adherence: 93, lastCheckin: "11 Feb 2026", daysSince: 0, program: "Yoga" },
  { id: 51, name: "Manuj Singh", status: "Active", adherence: 91, lastCheckin: "10 Feb 2026", daysSince: 0, program: "CrossFit" },
  { id: 52, name: "Rajani Rao", status: "Active", adherence: 87, lastCheckin: "10 Feb 2026", daysSince: 0, program: "Pilates" },
  { id: 53, name: "Shashank Singhal", status: "Active", adherence: 89, lastCheckin: "10 Feb 2026", daysSince: 0, program: "Bodybuilding" },
  { id: 54, name: "Harshwardhan Patil", status: "Active", adherence: 90, lastCheckin: "10 Feb 2026", daysSince: 0, program: "Fat Loss" },
  
  // At Risk (1) - REAL DATA
  { id: 42, name: "Moulima Das", status: "At Risk", adherence: 60, lastCheckin: "04 Feb 2026", daysSince: 6, program: "General Fitness" },
  
  // Ghosting Clients - REAL DATA from HubFit report
  { id: 6, name: "Himanshu Sharma", status: "Ghosting", adherence: 0, lastCheckin: "21 Jul 2025", daysSince: 205, program: "Strength" },
  { id: 22, name: "Hassan Shariq", status: "Ghosting", adherence: 5, lastCheckin: "05 Aug 2025", daysSince: 190, program: "General" },
  { id: 23, name: "Ridhi Moza", status: "Ghosting", adherence: 0, lastCheckin: "28 Aug 2025", daysSince: 167, program: "Weight Loss" },
  { id: 24, name: "Himanshu Sharma", status: "Ghosting", adherence: 0, lastCheckin: "01 Oct 2025", daysSince: 133, program: "Strength" },
  { id: 25, name: "Kriti Luked", status: "Ghosting", adherence: 0, lastCheckin: "04 Oct 2025", daysSince: 130, program: "Cardio" },
  { id: 26, name: "Shrey Prashar", status: "Ghosting", adherence: 0, lastCheckin: "22 Oct 2025", daysSince: 111, program: "HIIT" },
  { id: 27, name: "Sainikhil Nathi", status: "Ghosting", adherence: 0, lastCheckin: "23 Oct 2025", daysSince: 110, program: "Strength" },
  { id: 28, name: "Aditya Thanvi", status: "Ghosting", adherence: 0, lastCheckin: "31 Oct 2025", daysSince: 103, program: "Bodybuilding" },
  { id: 29, name: "Darsh Jain", status: "Ghosting", adherence: 0, lastCheckin: "07 Nov 2025", daysSince: 96, program: "Fat Loss" },
  { id: 30, name: "Sathwik Parthi", status: "Ghosting", adherence: 0, lastCheckin: "08 Nov 2025", daysSince: 95, program: "Muscle Gain" },
  { id: 31, name: "Shivam Singh", status: "Ghosting", adherence: 10, lastCheckin: "14 Nov 2025", daysSince: 88, program: "CrossFit" },
  { id: 32, name: "Vatsal Patel", status: "Ghosting", adherence: 0, lastCheckin: "19 Nov 2025", daysSince: 84, program: "General" },
  { id: 33, name: "Lekshmi S", status: "Ghosting", adherence: 0, lastCheckin: "20 Nov 2025", daysSince: 83, program: "Yoga" },
  { id: 34, name: "Aditi Jha", status: "Ghosting", adherence: 0, lastCheckin: "08 Dec 2025", daysSince: 65, program: "Weight Loss" },
  { id: 35, name: "Aditya Menon", status: "Ghosting", adherence: 15, lastCheckin: "17 Dec 2025", daysSince: 55, program: "Muscle Gain" },
  { id: 36, name: "Adrian Gianchand", status: "Ghosting", adherence: 0, lastCheckin: "26 Dec 2025", daysSince: 46, program: "Cardio" },
  { id: 37, name: "Maadhur Kapoor", status: "Ghosting", adherence: 20, lastCheckin: "07 Jan 2026", daysSince: 35, program: "HIIT" },
  { id: 38, name: "Vaishnavi Pamulapati", status: "Ghosting", adherence: 25, lastCheckin: "14 Jan 2026", daysSince: 28, program: "Pilates" },
  { id: 39, name: "Nita Ambedkar", status: "Ghosting", adherence: 30, lastCheckin: "13 Jan 2026", daysSince: 28, program: "General" },
  { id: 40, name: "Inder Swami", status: "Ghosting", adherence: 35, lastCheckin: "21 Jan 2026", daysSince: 21, program: "Strength" },
  { id: 41, name: "Swapnika Medikonda", status: "Ghosting", adherence: 40, lastCheckin: "03 Feb 2026", daysSince: 8, program: "Weight Loss" },
  
  // Archived - REAL DATA from HubFit
  { id: 1, name: "Kartikey Dixit", status: "Archived", adherence: 0, lastCheckin: "—", daysSince: 999, program: "Weight Loss" },
  { id: 2, name: "Saket Kasrekar", status: "Archived", adherence: 0, lastCheckin: "—", daysSince: 999, program: "Muscle Gain" },
  { id: 3, name: "Deepika Kumari", status: "Archived", adherence: 0, lastCheckin: "—", daysSince: 999, program: "General Fitness" },
  { id: 4, name: "Ambika Goel", status: "Archived", adherence: 15, lastCheckin: "16 Jan 2026", daysSince: 26, program: "Weight Loss" },
  { id: 5, name: "Sanjivika Pani", status: "Archived", adherence: 0, lastCheckin: "01 Jul 2025", daysSince: 225, program: "Cardio" },
  { id: 7, name: "Avik Mallick", status: "Archived", adherence: 0, lastCheckin: "17 Sep 2025", daysSince: 147, program: "Hypertrophy" },
  { id: 8, name: "Prateek Sharma", status: "Archived", adherence: 0, lastCheckin: "01 Oct 2025", daysSince: 133, program: "Fat Loss" },
  { id: 9, name: "Hereiz Likith", status: "Archived", adherence: 10, lastCheckin: "20 Oct 2025", daysSince: 113, program: "Bodybuilding" },
  { id: 10, name: "Sowndarya Krishnan", status: "Archived", adherence: 0, lastCheckin: "05 Nov 2025", daysSince: 98, program: "Weight Loss" },
  { id: 11, name: "Prateek Konnur", status: "Archived", adherence: 5, lastCheckin: "06 Nov 2025", daysSince: 96, program: "Powerlifting" },
  { id: 12, name: "Apurv Agnihotri", status: "Archived", adherence: 0, lastCheckin: "08 Nov 2025", daysSince: 95, program: "CrossFit" },
];

const highPriorityAlerts = [
  { name: "Hassan Shariq", days: 159, type: "CRITICAL" },
  { name: "Ridhi Moza", days: 136, type: "CRITICAL" },
  { name: "Himanshu Sharma", days: 133, type: "CRITICAL" },
  { name: "Kriti Luked", days: 130, type: "CRITICAL" },
  { name: "Shrey Prashar", days: 111, type: "HIGH" },
  { name: "Sainikhil Nathi", days: 110, type: "HIGH" },
  { name: "Aditya Thanvi", days: 103, type: "HIGH" },
  { name: "Darsh Jain", days: 96, type: "HIGH" },
  { name: "Sathwik Parthi", days: 95, type: "HIGH" },
  { name: "Shivam Singh", days: 88, type: "MEDIUM" },
  { name: "Vatsal Patel", days: 84, type: "MEDIUM" },
  { name: "Lekshmi S", days: 83, type: "MEDIUM" },
];

export default function Home() {
  const [sortField, setSortField] = useState<keyof Client>('daysSince');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const sortedClients = [...clients].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredClients = filterStatus === 'All' 
    ? sortedClients 
    : sortedClients.filter(c => c.status === filterStatus);

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Ghosting': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 80) return 'bg-green-600';
    if (adherence >= 50) return 'bg-yellow-600';
    if (adherence > 0) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getDaysColor = (days: number) => {
    if (days > 100 || days === 999) return 'text-red-600 dark:text-red-400';
    if (days > 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          HubFit Dashboard
        </h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          54 clients • Updated: Feb 11, 2026
        </p>
      </div>

      {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-300 text-lg sm:text-xl font-bold">12</span>
            </div>
            <div className="ml-3 min-w-0">
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white truncate">Active</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">≤3 days check-in</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600 dark:text-yellow-300 text-lg sm:text-xl font-bold">1</span>
            </div>
            <div className="ml-3 min-w-0">
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white truncate">At Risk</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">4-7 days no check-in</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-300 text-lg sm:text-xl font-bold">30</span>
            </div>
            <div className="ml-3 min-w-0">
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white truncate">Ghosting</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">&gt;7 days no activity</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl font-bold">11</span>
            </div>
            <div className="ml-3 min-w-0">
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white truncate">Archived</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Inactive clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* High Priority Alerts - Horizontal scroll on mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
            ⚠️ High Priority Alerts
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {highPriorityAlerts.slice(0, 6).map((alert, idx) => (
              <div key={idx} className="flex-shrink-0 w-64 sm:w-auto flex items-center justify-between p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center min-w-0">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <span className="text-red-600 dark:text-red-300 font-bold text-sm">!</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{alert.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{alert.days} days</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                  alert.type === 'CRITICAL' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200' :
                  alert.type === 'HIGH' ? 'bg-orange-200 text-orange-800 dark:bg-orange-700 dark:text-orange-200' :
                  'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                }`}>
                  {alert.type}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            + 6 more clients ghosting &gt;14 days
          </p>
        </div>
      </div>

      {/* Client List - Mobile Filter & Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              Client Details
            </h3>
            {/* Mobile Filter Dropdown */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="sm:hidden px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Clients</option>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
              <option value="Ghosting">Ghosting</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Mobile: Card View */}
        <div className="sm:hidden">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center min-w-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{client.name}</div>
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full mt-1 ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Adherence</span>
                  <div className="flex items-center mt-1">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                      <div className={`${getAdherenceColor(client.adherence)} h-1.5 rounded-full`} style={{ width: `${client.adherence}%` }}></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{client.adherence}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Days Since</span>
                  <div className={`font-medium text-sm ${getDaysColor(client.daysSince)}`}>
                    {client.daysSince === 999 ? '—' : client.daysSince}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Last Check-in</span>
                  <div className="text-gray-700 dark:text-gray-300 text-xs">{client.lastCheckin}</div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Program</span>
                  <div className="text-gray-700 dark:text-gray-300 text-xs truncate">{client.program}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Client {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('adherence')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Adherence {sortField === 'adherence' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('lastCheckin')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Last Check-in {sortField === 'lastCheckin' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('daysSince')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Days Since {sortField === 'daysSince' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Program
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div className={`${getAdherenceColor(client.adherence)} h-2 rounded-full`} style={{ width: `${client.adherence}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{client.adherence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {client.lastCheckin}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getDaysColor(client.daysSince)}`}>
                      {client.daysSince === 999 ? '—' : client.daysSince}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {client.program}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">54</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Clients</div>
          </div>
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400">18</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Need Attention</div>
          </div>
          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">22%</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
