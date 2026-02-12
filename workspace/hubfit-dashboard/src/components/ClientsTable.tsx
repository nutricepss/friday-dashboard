import React, { useState, useMemo } from 'react';
import { Client } from '@/types';
import { Search, ChevronUp, ChevronDown, Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface ClientsTableProps {
  clients: Client[];
  showAll?: boolean; // New prop to control showing all clients vs top 15
}

type SortField = 'name' | 'lastCheckin' | 'daysSinceCheckin' | 'status' | 'adherencePercentage';
type SortDirection = 'asc' | 'desc';

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, showAll = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('adherencePercentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'lastCheckin':
          aValue = a.lastCheckin?.getTime() || 0;
          bValue = b.lastCheckin?.getTime() || 0;
          break;
        case 'daysSinceCheckin':
          aValue = a.daysSinceCheckin ?? Infinity;
          bValue = b.daysSinceCheckin ?? Infinity;
          break;
        case 'status':
          const statusOrder = { active: 0, 'at-risk': 1, ghosting: 2, expiring: 3, archived: 4 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'adherencePercentage':
          aValue = a.adherencePercentage ?? 0;
          bValue = b.adherencePercentage ?? 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Show top 15 by default unless showAll is true
    if (!showAll) {
      return filtered.slice(0, 15);
    }

    return filtered;
  }, [clients, searchTerm, sortField, sortDirection, statusFilter, showAll]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Active</span>;
      case 'at-risk':
        return <span className="status-badge status-at-risk">At Risk</span>;
      case 'ghosting':
        return <span className="status-badge status-ghosting">Ghosting</span>;
      case 'expiring':
        return <span className="status-badge status-expiring">Expiring</span>;
      case 'archived':
        return <span className="status-badge status-archived">Archived</span>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return '—';
    return format(date, 'MMM dd');
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'ghosting', label: 'Ghosting' },
    { value: 'expiring', label: 'Expiring' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Client Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredAndSortedClients.length} of {clients.length} clients shown
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none w-full sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">
                <button
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('name')}
                >
                  Client Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('adherencePercentage')}
                >
                  Adherence %
                  {sortField === 'adherencePercentage' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('lastCheckin')}
                >
                  Last Check-in
                  {sortField === 'lastCheckin' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('daysSinceCheckin')}
                >
                  Days Since
                  {sortField === 'daysSinceCheckin' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">Plans</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </div>
                    {client.email && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(client.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.adherencePercentage ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (client.adherencePercentage ?? 0) >= 80 ? 'bg-success-500' :
                          (client.adherencePercentage ?? 0) >= 50 ? 'bg-warning-500' :
                          'bg-danger-500'
                        }`}
                        style={{ width: `${client.adherencePercentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {formatDate(client.lastCheckin)}
                      </span>
                    </div>
                    {client.lastCheckin && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                        {formatDateShort(client.lastCheckin)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`font-medium ${
                    client.daysSinceCheckin === null ? 'text-gray-500' :
                    client.daysSinceCheckin <= 3 ? 'text-success-600 dark:text-success-400' :
                    client.daysSinceCheckin <= 7 ? 'text-warning-600 dark:text-warning-400' :
                    'text-danger-600 dark:text-danger-400'
                  }`}>
                    {client.daysSinceCheckin ?? '—'} days
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {client.hasWorkoutPlan ? (
                        <CheckCircle className="w-4 h-4 text-success-500 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                      )}
                      <span className="text-sm">Workout</span>
                    </div>
                    <div className="flex items-center">
                      {client.hasMealPlan ? (
                        <CheckCircle className="w-4 h-4 text-success-500 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                      )}
                      <span className="text-sm">Meal</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedClients.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No clients found
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;