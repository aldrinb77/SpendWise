-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- UUID
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at INTEGER NOT NULL, -- Unix timestamp
  settings TEXT DEFAULT '{}' -- JSON string
);

-- Sessions Table (can also use KV for this, but D1 for persistence)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date INTEGER NOT NULL, -- Unix timestamp
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  category_id TEXT NOT NULL,
  payment_method TEXT,
  description TEXT,
  notes TEXT,
  tags TEXT, -- JSON array as string
  is_recurring INTEGER DEFAULT 0, -- Boolean
  recurring_id TEXT,
  attachment_url TEXT, -- R2 URL
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (recurring_id) REFERENCES recurring_transactions(id)
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- Categories Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- NULL for default categories
  name TEXT NOT NULL,
  icon TEXT, -- Emoji or icon name
  color TEXT, -- Hex color
  is_default INTEGER DEFAULT 0,
  sort_order INTEGER,
  UNIQUE(user_id, name)
);

-- Recurring Transactions Table
CREATE TABLE recurring_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  category_id TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly', 'custom'
  frequency_value INTEGER, -- For custom (e.g., every 15 days)
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  auto_create INTEGER DEFAULT 1,
  reminder_days INTEGER DEFAULT 3,
  last_created_date INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Budgets Table
CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  month INTEGER NOT NULL, -- YYYYMM format
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, category_id, month),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Merchant Mappings (for auto-categorization learning)
CREATE TABLE merchant_mappings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  confidence INTEGER DEFAULT 100,
  times_used INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, merchant_name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insights Cache Table
CREATE TABLE insights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  period TEXT NOT NULL, -- YYYY-MM format
  summary TEXT, -- Natural language summary
  insights_data TEXT, -- JSON array of insight objects
  generated_at INTEGER NOT NULL,
  UNIQUE(user_id, period),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Import History Table
CREATE TABLE import_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, xlsx, csv
  transactions_count INTEGER,
  imported_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
