
export interface SecurityTool {
  id: string;
  name: string;
  category: 'Network' | 'Web' | 'System' | 'Privacy';
  description: string;
  icon: string;
  url: string;
}

export interface SecurityTip {
  title: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  TIPS = 'TIPS',
  TOOLKIT = 'TOOLKIT',
  ANALYZE = 'ANALYZE',
  AI_ASSISTANT = 'AI_ASSISTANT'
}
