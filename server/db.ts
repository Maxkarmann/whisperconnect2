// Mock database for development when no DATABASE_URL is provided
class MockDB {
  users = new Map();
  tasks = new Map();
  apiUsage = new Map();
  sessions = new Map();
  
  async insert(table: any) {
    return {
      values: (data: any) => {
        const id = Date.now().toString();
        const store = this.getStore(table);
        const record = { ...data, id, createdAt: new Date() };
        store.set(id, record);
        return { returning: () => [record] };
      }
    };
  }
  
  async select() {
    return {
      from: (table: any) => ({
        where: () => ({ limit: () => [] }),
        orderBy: () => ({ limit: () => [] }),
        limit: () => []
      })
    };
  }
  
  getStore(table: any) {
    // Simple table name detection
    if (table.toString().includes('users')) return this.users;
    if (table.toString().includes('tasks')) return this.tasks;
    if (table.toString().includes('apiUsage')) return this.apiUsage;
    return this.sessions;
  }
}

// Database configuration for Vercel deployment
let db: any;

const isProduction = process.env.NODE_ENV === 'production';
const hasValidDatabaseUrl = process.env.DATABASE_URL && 
  process.env.DATABASE_URL !== 'postgresql://user:password@localhost:5432/trello_dictate_dev';

if (isProduction && hasValidDatabaseUrl) {
  // Production: Use Neon/PostgreSQL
  try {
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    const ws = require("ws");
    
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { drizzle } = require('drizzle-orm/neon-serverless');
    const schema = require("@shared/schema");
    db = drizzle({ client: pool, schema });
    console.log("✅ Connected to production database");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("🔄 Falling back to mock database");
    db = new MockDB();
  }
} else {
  // Development or no valid database URL: Use mock database
  console.log("🧪 Using mock database for development/testing");
  db = new MockDB();
}

export { db };