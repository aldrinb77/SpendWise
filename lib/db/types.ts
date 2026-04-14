export interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  avatar_url?: string;
  created_at: number;
  settings?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: number;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  payment_method?: string;
  description?: string;
  notes?: string;
  tags?: string;
  is_recurring: number;
  recurring_id?: string;
  attachment_url?: string;
  created_at: number;
  updated_at: number;
}

export interface Category {
  id: string;
  user_id?: string;
  name: string;
  icon?: string;
  color?: string;
  is_default: number;
  sort_order?: number;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category_id: string;
  frequency: string;
  frequency_value?: number;
  start_date: number;
  end_date?: number;
  auto_create: number;
  reminder_days: number;
  last_created_date?: number;
  is_active: number;
  created_at: number;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: number;
  amount: number;
  created_at: number;
}
