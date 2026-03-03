import { Capacitor } from "@capacitor/core";
import type { StorageProvider } from "@/app/di/contracts";
import {
  CapacitorSQLite,
  SQLiteConnection as SQLiteConnectionImpl,
  type SQLiteDBConnection,
} from "@capacitor-community/sqlite";

const DATABASE_NAME = "gencalories_storage";
const TABLE_NAME = "key_value";

const KEY_VALUE_TABLE_SCHEMA = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (key TEXT PRIMARY KEY, value TEXT);`;

export class MobileStorageProvider implements StorageProvider {
  private database: SQLiteDBConnection | null = null;
  private readonly ready: Promise<void>;

  constructor() {
    this.ready = this.initialize();
  }

  private async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const connection = new SQLiteConnectionImpl(CapacitorSQLite);

    this.database = await connection.createConnection(
      DATABASE_NAME,
      false,
      "no-encryption",
      1,
      false,
    );

    await this.database.open();
    await this.database.execute(KEY_VALUE_TABLE_SCHEMA);
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  private ensureDatabase(): SQLiteDBConnection {
    if (!this.database) {
      throw new Error("SQLite database connection is not initialized");
    }

    return this.database;
  }

  private extractValueFromRow(rows?: unknown[]): string | null {
    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    if (Array.isArray(row)) {
      const raw = row[0];
      return raw == null ? null : String(raw);
    }

    if (row && typeof row === "object") {
      const values = Object.values(row);
      if (values.length === 0) {
        return null;
      }

      const raw = values[0];
      return raw == null ? null : String(raw);
    }

    return null;
  }

  async getItem(key: string): Promise<string | null> {
    await this.ensureReady();
    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    const result = await this.ensureDatabase().query(`SELECT value FROM ${TABLE_NAME} WHERE key = ?;`, [key]);

    return this.extractValueFromRow(result?.values);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.ensureReady();
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await this.ensureDatabase().run(
      `INSERT INTO ${TABLE_NAME} (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      [key, value],
    );
  }

  async removeItem(key: string): Promise<void> {
    await this.ensureReady();
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await this.ensureDatabase().run(`DELETE FROM ${TABLE_NAME} WHERE key = ?;`, [key]);
  }
}