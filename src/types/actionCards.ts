export type ActionType = 'yield' | 'alert' | 'degen' | 'safe';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ActionCard {
  id: string;
  type: ActionType;
  icon: string;
  title: string;
  description: string;
  risk?: RiskLevel;
  confidence?: number;
  metric?: string;
  metricValue?: string;
}
