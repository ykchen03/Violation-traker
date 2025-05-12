export interface Violation {
    id: string;
    plate: string;
    count: number;
    //created_at: string;
    //updated_at: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'user';
  }
  
  export type AuthState = {
    user: User | null;
    loading: boolean;
  };
  