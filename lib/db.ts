import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "edith.db");

declare global {
  var __edithDb: Database.Database | undefined;
}

function createConnection() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      authorName TEXT NOT NULL,
      authorRole TEXT NOT NULL,
      authorAvatarUrl TEXT NOT NULL,
      coverImageUrl TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      bodyHtml TEXT NOT NULL,
      readTimeMinutes INTEGER NOT NULL,
      seoMetaDescription TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'drafting',
      publishedAt TEXT,
      scheduledFor TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  return db;
}

export function getDb(): Database.Database {
  if (!global.__edithDb) {
    global.__edithDb = createConnection();
  }
  return global.__edithDb;
}
