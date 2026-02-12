import React from 'react';
import { Alert } from '@/types';
import { AlertTriangle, Clock, Calendar, Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'ghosting':
        return Clock;
      case 'expiring':
        return Calendar;
      case 'no-plans':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800';
      case 'medium':
        return 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800';
      case 'low':
        return 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800';
    }
  };

  const getSeverityText = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alerts & Notifications
          </h3>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/30 mb-4">
            <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Active Alerts
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            All clients are in good standing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alerts & Notifications
        </h3>
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-gray-400 mr-2" />
          <span className="bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'high' ? 'bg-danger-100 dark:bg-danger-900/30' :
                    alert.severity === 'medium' ? 'bg-warning-100 dark:bg-warning-900/30' :
                    'bg-info-100 dark:bg-info-900/30'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      alert.severity === 'high' ? 'text-danger-600 dark:text-danger-400' :
                      alert.severity === 'medium' ? 'text-warning-600 dark:text-warning-400' :
                      'text-info-600 dark:text-info-400'
                    }`} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {alert.clientName}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert.severity === 'high' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300' :
                      alert.severity === 'medium' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300' :
                      'bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-300'
                    }`}>
                      {getSeverityText(alert.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>
                      {alert.type === 'ghosting' ? 'Ghosting for' :
                       alert.type === 'expiring' ? 'Expires in' :
                       'No plans for'} {alert.days} {alert.days === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Import CheckCircle for the no alerts state
import { CheckCircle } from 'lucide-react';

export default AlertsPanel;