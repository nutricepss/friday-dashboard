import React from 'react';
import { DashboardStats } from '@/types';
import { Users, CheckCircle, AlertTriangle, Clock, Archive } from 'lucide-react';

interface StatsCardProps {
  stats: DashboardStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Active',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      description: '≤3 days since check-in',
    },
    {
      title: 'At Risk',
      value: stats.atRisk,
      icon: AlertTriangle,
      color: 'text-warning-600 dark:text-warning-400',
      bgColor: 'bg-warning-50 dark:bg-warning-900/20',
      description: '4-7 days since check-in',
    },
    {
      title: 'Ghosting',
      value: stats.ghosting,
      icon: Clock,
      color: 'text-danger-600 dark:text-danger-400',
      bgColor: 'bg-danger-50 dark:bg-danger-900/20',
      description: '>7 days since check-in',
    },
    {
      title: 'Expiring',
      value: stats.expiring,
      icon: AlertTriangle,
      color: 'text-info-600 dark:text-info-400',
      bgColor: 'bg-info-50 dark:bg-info-900/20',
      description: '<14 days to subscription end',
    },
    {
      title: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      description: 'Inactive/archived clients',
    },
    {
      title: 'Total',
      value: stats.total,
      icon: Users,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      description: 'All clients',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={`card ${item.bgColor} border-0`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;