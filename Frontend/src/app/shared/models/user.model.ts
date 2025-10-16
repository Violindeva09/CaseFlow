export interface User {
  _id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent' | 'citizen' | 'supervisor';
  skills?: string[];
  capacity?: number;
  workload?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
