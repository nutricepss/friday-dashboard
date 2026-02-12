'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/dataService';
import ClientsTable from '@/components/ClientsTable';
import { ThemeToggle } from '@/components/ThemeProvider';
import { RefreshCw, Users, Calendar, Download, Home, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientsPage() {
  const [dataService] = useState(() => DataService.getInstance());
  const [clients, setClients] = useState(dataService.getClients());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    dataService.refreshData();
    setClients(dataService.getClients());
    setLastUpdated(new Date());
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const exportData = () => {
    const data = {
      clients,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hubfit-clients-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    atRisk: clients.filter(c => c.status === 'at-risk').length,
    ghosting: clients.filter(c => c.status === 'ghosting').length,
    archived: clients.filter(c => c.status === 'archived').length,
  };

  // Calculate average adherence
  const averageAdherence = clients.length > 0 
    ? Math.round(clients.reduce((sum, client) => sum + (client.adherencePercentage || 0), 0) / clients.length)
    : 0;

  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link 
                  href="/" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Home className="w-4 h-4" />
                </Link>
                <span className="text-gray-400">/</span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Users className="w-6 h-6 mr-2 text-primary-600" />
                  All Clients
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Complete client list with detailed adherence metrics and sorting
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last updated: {format(lastUpdated, 'MMM dd, HH:mm')}
                </div>
              </div>
              
              <button
                onClick={exportData}
                className="btn-secondary flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="btn-primary flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">{stats.active}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-success-500"></div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{stats.atRisk}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-warning-500"></div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ghosting</p>
                <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{stats.ghosting}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-danger-100 dark:bg-danger-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-danger-500"></div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Adherence</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageAdherence}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <section>
          <ClientsTable clients={clients} showAll={true} />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p>Showing all {clients.length} clients • Sorted by adherence percentage</p>
              <p className="mt-1">Click column headers to sort by different criteria</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/analytics" 
                className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
              >
                View analytics
                <BarChart3 className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}