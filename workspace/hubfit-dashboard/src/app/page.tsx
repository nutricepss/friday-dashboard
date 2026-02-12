'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/dataService';
import StatsCard from '@/components/StatsCard';
import AlertsPanel from '@/components/AlertsPanel';
import ClientsTable from '@/components/ClientsTable';
import Charts from '@/components/Charts';
import { ThemeToggle } from '@/components/ThemeProvider';
import { RefreshCw, Users, Calendar, Download, Home } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const [dataService] = useState(() => DataService.getInstance());
  const [clients, setClients] = useState(dataService.getClients());
  const [stats, setStats] = useState(dataService.getStats());
  const [alerts, setAlerts] = useState(dataService.getAlerts());
  const [trendData, setTrendData] = useState(dataService.getTrendData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    dataService.refreshData();
    setClients(dataService.getClients());
    setStats(dataService.getStats());
    setAlerts(dataService.getAlerts());
    setTrendData(dataService.getTrendData());
    setLastUpdated(new Date());
    
    // Simulate API delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const exportData = () => {
    const data = {
      clients,
      stats,
      alerts,
      trendData,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hubfit-adherence-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="p-6">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Home className="w-6 h-6 mr-2 text-primary-600" />
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time monitoring of client engagement and adherence metrics
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
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Overview
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(), 'MMMM dd, yyyy')}
            </div>
          </div>
          <StatsCard stats={stats} />
        </section>

        {/* Alerts and Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AlertsPanel alerts={alerts} />
          </div>
          <div className="lg:col-span-2">
            <Charts trendData={trendData} stats={stats} />
          </div>
        </section>

        {/* Clients Table */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Clients by Adherence
            </h2>
            <Link 
              href="/clients" 
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              View all clients
              <Users className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <ClientsTable clients={clients} showAll={false} />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p>NutriCepss HubFit Dashboard • v1.0.0</p>
              <p className="mt-1">Data updates automatically every 5 minutes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p>© {new Date().getFullYear()} NutriCepss. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}