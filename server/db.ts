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

// For development without database setup, use mock
let db: any;

try {
  if (process.env.DATABASE_URL) {
    // Try to use the provided database
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    const ws = require("ws");
    
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { drizzle } = require('drizzle-orm/neon-serverless');
    const schema = require("@shared/schema");
    db = drizzle({ client: pool, schema });
  } else {
    // Use mock database for development
    console.log("Using mock database for development");
    db = new MockDB();
  }
} catch (error) {
  console.log("Database connection failed, using mock database for development");
  db = new MockDB();
}

export { db };