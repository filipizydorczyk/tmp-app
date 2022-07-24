import sqlite3 from "sqlite3";
import path from "path";
import { DbVersion, VerionResolvers, getVersion } from "@tmp/back/db/version";

export const DB_PATH =
  process.env.SQLITE_PATH || path.join(__dirname, "../../database.db");

export const SINGLETON_TABLE_NAME = "Singletons";
export const TASK_TABLE_NAME = "Tasks";

export const PASSWORD_KEY = "password";
export const NOTES_KEY = "notes";
export const DB_VERSION_KEY = "version";

const sqlite = sqlite3.verbose();

export type Database = {
  path?: string;
};

export const getDatabase = async ({ path = DB_PATH }: Database) => {
  const db = new sqlite.Database(path);
  let version = await getVersion(db);

  if (version !== DbVersion.V1) {
    do {
      await VerionResolvers[version](db);
      version = await getVersion(db);
    } while (version !== DbVersion.V1);
  }

  return db;
};
