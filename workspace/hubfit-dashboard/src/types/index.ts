export interface Client {
  id: string;
  name: string;
  email?: string;
  lastCheckin: Date | null;
  lastActive: Date | null;
  daysSinceCheckin: number | null;
  daysSinceActive: number | null;
  status: 'active' | 'at-risk' | 'ghosting' | 'expiring' | 'archived';
  hasWorkoutPlan: boolean;
  hasMealPlan: boolean;
  subscriptionEnd: Date | null;
  subscriptionDaysLeft: number | null;
  archived: boolean;
  workoutPlans: string[];
  mealPlans: string[];
  adherencePercentage?: number; // New field for adherence percentage
}

export interface DashboardStats {
  active: number;
  atRisk: number;
  ghosting: number;
  expiring: number;
  archived: number;
  total: number;
}

export interface Alert {
  id: string;
  clientId: string;
  clientName: string;
  type: 'ghosting' | 'expiring' | 'no-plans';
  severity: 'high' | 'medium' | 'low';
  message: string;
  days: number;
}

export interface TrendData {
  date: string;
  active: number;
  atRisk: number;
  ghosting: number;
  adherenceRate: number;
}