export interface Case {
  _id: string;
  title: string;
  description?: string;
  customerId: string | User;
  priority: 'low' | 'medium' | 'high' | 'critical';
  topic?: string;
  tier: 'standard' | 'premium';
  status: 'open' | 'assigned' | 'in_progress' | 'escalated' | 'resolved';
  assignedTo?: string | User;
  assignedAt?: Date;
  createdAtClient: Date;
  slaDeadline: Date;
  history: { by: string; action: string; at: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent' | 'citizen';
  skills?: string[];
  capacity?: number;
  workload?: number;
}
