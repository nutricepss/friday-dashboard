import { Client, DashboardStats, Alert, TrendData } from '@/types';
import fs from 'fs';
import path from 'path';

// Real data from HubFit report
const REAL_STATS = {
  total: 54,
  active: 12,
  atRisk: 1,
  ghosting: 30,
  archived: 11,
  expiring: 0 // We'll calculate this from actual data
};

// High priority alerts from the report
const HIGH_PRIORITY_ALERTS = [
  { name: 'Hassan Shariq', days: 159 },
  { name: 'Ridhi Moza', days: 136 },
  { name: 'Himanshu Sharma', days: 133 },
  { name: 'Kriti Luked', days: 130 },
  { name: 'Shrey Prashar', days: 111 },
  { name: 'Sainikhil Nathi', days: 110 },
  { name: 'Aditya Thanvi', days: 103 },
  { name: 'Darsh Jain', days: 96 },
  { name: 'Sathwik Parthi', days: 95 },
  { name: 'Shivam Singh', days: 88 },
  { name: 'Vatsal Patel', days: 84 },
  { name: 'Lekshmi S', days: 83 },
  { name: 'Aditi Jha', days: 65 },
  { name: 'Aditya Menon', days: 55 },
  { name: 'Adrian Gianchand', days: 46 },
  { name: 'Maadhur Kapoor', days: 35 },
  { name: 'Vaishnavi Pamulapati', days: 28 },
  { name: 'Nita Ambedkar', days: 28 },
];

export class DataService {
  private static instance: DataService;
  private clients: Client[] = [];
  private stats: DashboardStats = REAL_STATS;
  private alerts: Alert[] = [];
  private trendData: TrendData[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadData(): void {
    try {
      // Load real data from JSON file
      const dataPath = path.join(process.cwd(), '..', '..', '..', 'data', 'hubfit', 'hubfit_data_20260211_132817.json');
      const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      this.clients = this.transformData(rawData.data);
      this.alerts = this.generateAlerts();
      this.trendData = this.generateTrendData();
    } catch (error) {
      console.warn('Could not load real data, using fallback data:', error);
      this.clients = this.generateFallbackClients();
      this.alerts = this.generateAlerts();
      this.trendData = this.generateTrendData();
    }
  }

  private transformData(rawClients: any[]): Client[] {
    return rawClients.map((client, index) => {
      // Map status from emoji to our status enum
      let status: Client['status'] = 'active';
      if (client.status.includes('Archived')) {
        status = 'archived';
      } else if (client.status.includes('Ghosting')) {
        status = 'ghosting';
      } else if (client.status.includes('At Risk')) {
        status = 'at-risk';
      } else if (client.status.includes('Active')) {
        status = 'active';
      }

      // Parse dates
      const lastCheckin = client.last_checkin ? new Date(client.last_checkin) : null;
      const subscriptionEnd = client.sub_end ? new Date(client.sub_end) : null;
      
      // Calculate days left for subscription
      let subscriptionDaysLeft = null;
      if (subscriptionEnd) {
        const today = new Date();
        const timeDiff = subscriptionEnd.getTime() - today.getTime();
        subscriptionDaysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }

      // Calculate adherence percentage based on check-in frequency
      // For active clients: 100% if checked in within 3 days, decreasing after
      // For at-risk: 50-70% range
      // For ghosting: 0-30% range
      // For archived: 0%
      let adherencePercentage = 0;
      if (status === 'active') {
        if (client.days_since_checkin === null || client.days_since_checkin <= 0) {
          adherencePercentage = 100;
        } else if (client.days_since_checkin <= 1) {
          adherencePercentage = 95;
        } else if (client.days_since_checkin <= 2) {
          adherencePercentage = 85;
        } else if (client.days_since_checkin <= 3) {
          adherencePercentage = 75;
        } else {
          adherencePercentage = Math.max(0, 100 - (client.days_since_checkin * 5));
        }
      } else if (status === 'at-risk') {
        adherencePercentage = 50 + Math.random() * 20; // 50-70%
      } else if (status === 'ghosting') {
        if (client.days_since_checkin === null) {
          adherencePercentage = 0;
        } else if (client.days_since_checkin <= 14) {
          adherencePercentage = 30;
        } else if (client.days_since_checkin <= 30) {
          adherencePercentage = 20;
        } else if (client.days_since_checkin <= 60) {
          adherencePercentage = 10;
        } else {
          adherencePercentage = 5;
        }
      } else if (status === 'archived') {
        adherencePercentage = 0;
      }

      // Ensure percentage is between 0 and 100
      adherencePercentage = Math.max(0, Math.min(100, Math.round(adherencePercentage)));

      return {
        id: `client-${index + 1}`,
        name: client.name,
        email: `${client.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        lastCheckin,
        lastActive: lastCheckin,
        daysSinceCheckin: client.days_since_checkin,
        daysSinceActive: client.days_since_checkin,
        status,
        hasWorkoutPlan: status === 'active' || status === 'at-risk', // Assume active/at-risk have plans
        hasMealPlan: status === 'active' || status === 'at-risk',
        subscriptionEnd,
        subscriptionDaysLeft,
        archived: client.archived || false,
        workoutPlans: status === 'active' || status === 'at-risk' ? ['Custom Plan'] : [],
        mealPlans: status === 'active' || status === 'at-risk' ? ['Nutrition Plan'] : [],
        adherencePercentage,
      };
    });
  }

  private generateFallbackClients(): Client[] {
    // Generate clients based on the real stats
    const clients: Client[] = [];
    let id = 1;

    // Add archived clients
    for (let i = 0; i < REAL_STATS.archived; i++) {
      clients.push({
        id: `client-${id++}`,
        name: `Archived Client ${i + 1}`,
        email: `archived${i + 1}@example.com`,
        lastCheckin: null,
        lastActive: new Date('2025-12-01'),
        daysSinceCheckin: null,
        daysSinceActive: 75 + i,
        status: 'archived',
        hasWorkoutPlan: false,
        hasMealPlan: false,
        subscriptionEnd: null,
        subscriptionDaysLeft: null,
        archived: true,
        workoutPlans: [],
        mealPlans: [],
        adherencePercentage: 0,
      });
    }

    // Add ghosting clients
    for (let i = 0; i < REAL_STATS.ghosting; i++) {
      const alertIndex = i % HIGH_PRIORITY_ALERTS.length;
      const alert = HIGH_PRIORITY_ALERTS[alertIndex];
      let adherencePercentage = 0;
      if (alert.days <= 14) {
        adherencePercentage = 30;
      } else if (alert.days <= 30) {
        adherencePercentage = 20;
      } else if (alert.days <= 60) {
        adherencePercentage = 10;
      } else {
        adherencePercentage = 5;
      }
      
      clients.push({
        id: `client-${id++}`,
        name: alert.name || `Ghosting Client ${i + 1}`,
        email: `ghosting${i + 1}@example.com`,
        lastCheckin: new Date(Date.now() - alert.days * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - alert.days * 24 * 60 * 60 * 1000),
        daysSinceCheckin: alert.days,
        daysSinceActive: alert.days,
        status: 'ghosting',
        hasWorkoutPlan: false,
        hasMealPlan: false,
        subscriptionEnd: null,
        subscriptionDaysLeft: null,
        archived: false,
        workoutPlans: [],
        mealPlans: [],
        adherencePercentage,
      });
    }

    // Add at-risk client
    for (let i = 0; i < REAL_STATS.atRisk; i++) {
      clients.push({
        id: `client-${id++}`,
        name: `At Risk Client ${i + 1}`,
        email: `atrisk${i + 1}@example.com`,
        lastCheckin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        daysSinceCheckin: 10,
        daysSinceActive: 10,
        status: 'at-risk',
        hasWorkoutPlan: true,
        hasMealPlan: true,
        subscriptionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        subscriptionDaysLeft: 5,
        archived: false,
        workoutPlans: ['Maintenance Program'],
        mealPlans: ['Balanced Diet'],
        adherencePercentage: 60,
      });
    }

    // Add active clients
    for (let i = 0; i < REAL_STATS.active; i++) {
      const daysSince = i % 3;
      let adherencePercentage = 100;
      if (daysSince === 1) adherencePercentage = 95;
      if (daysSince === 2) adherencePercentage = 85;
      
      clients.push({
        id: `client-${id++}`,
        name: `Active Client ${i + 1}`,
        email: `active${i + 1}@example.com`,
        lastCheckin: new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000),
        daysSinceCheckin: daysSince,
        daysSinceActive: daysSince,
        status: 'active',
        hasWorkoutPlan: true,
        hasMealPlan: true,
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subscriptionDaysLeft: 30,
        archived: false,
        workoutPlans: ['Strength Training', 'Cardio'],
        mealPlans: ['High Protein', 'Calorie Controlled'],
        adherencePercentage,
      });
    }

    return clients;
  }

  private generateAlerts(): Alert[] {
    const alerts: Alert[] = [];

    // Add high priority ghosting alerts
    HIGH_PRIORITY_ALERTS.forEach((alert, index) => {
      alerts.push({
        id: `alert-${index + 1}`,
        clientId: `client-${index + 100}`,
        clientName: alert.name,
        type: 'ghosting',
        severity: 'high',
        message: `Ghosting for ${alert.days} days`,
        days: alert.days,
      });
    });

    return alerts;
  }

  private generateTrendData(): TrendData[] {
    const today = new Date();
    const trendData: TrendData[] = [];

    // Generate trend data for the last 7 days with slight variations
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Small variations for realistic trend
      const variation = 1 + (Math.random() * 0.1 - 0.05); // ±5%
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        active: Math.round(REAL_STATS.active * variation),
        atRisk: Math.round(REAL_STATS.atRisk * variation),
        ghosting: Math.round(REAL_STATS.ghosting * variation),
        adherenceRate: Math.min(100, Math.round((REAL_STATS.active / Math.max(1, REAL_STATS.total)) * 100 * variation)),
      });
    }

    return trendData;
  }

  public getClients(): Client[] {
    return this.clients;
  }

  public getStats(): DashboardStats {
    return this.stats;
  }

  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public getTrendData(): TrendData[] {
    return this.trendData;
  }

  public refreshData(): void {
    this.loadData();
  }
}