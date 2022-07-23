import sqlite3, { RunResult } from "sqlite3";
import {
  DB_VERSION_KEY,
  SINGLETON_TABLE_NAME,
  TASK_TABLE_NAME,
} from "@tmp/back/db/db";

export enum DbVersion {
  V1 = "v1",
  V2 = "v2",
}

const execute = async (db: sqlite3.Database, sql: string) => {
  return new Promise(async (resolve, reject) => {
    db.run(sql, (result: RunResult, err: Error | null) => {
      if (err) {
        resolve(err);
      } else {
        resolve(result);
      }
    });
  });
};

const fetch = async (db: sqlite3.Database, sql: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const v1 = async (db: sqlite3.Database) => {
  await execute(
    db,
    `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
  );
  await execute(
    db,
    `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
  );
  await execute(
    db,
    `INSERT INTO ${SINGLETON_TABLE_NAME} VALUES ('${DB_VERSION_KEY}', '${DbVersion.V1.toString()}')`
  );
};

const v2 = async (db: sqlite3.Database) => {
  console.log("v2");
  Promise.resolve();
};

export const getVersion = async (
  db: sqlite3.Database
): Promise<DbVersion | null> => {
  const tableExistsSql = `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='${SINGLETON_TABLE_NAME}'`;
  const fetchVersionSql = `SELECT Value FROM ${SINGLETON_TABLE_NAME} WHERE Key='${DB_VERSION_KEY}'`;

  const existsResponse = await fetch(db, tableExistsSql);

  const tableExists = Boolean(existsResponse["COUNT(*)"]);

  if (tableExists) {
    const response = await fetch(db, fetchVersionSql);

    return response["Value"];
  }

  return null;
};

export const VerionResolvers: Record<
  DbVersion,
  (db: sqlite3.Database) => Promise<void>
> = {
  [DbVersion.V1]: v1,
  [DbVersion.V2]: v2,
} as const;
