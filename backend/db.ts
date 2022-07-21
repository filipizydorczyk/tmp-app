import sqlite3 from "sqlite3";
import path from "path";

export const DB_PATH =
  process.env.SQLITE_PATH || path.join(__dirname, "../database.db");
export const SINGLETON_TABLE_NAME = "Singletons";
export const TASK_TABLE_NAME = "Tasks";

const sqlite = sqlite3.verbose();

const versions = <const>["1.0"];

export type DatabaseVersion = "latest" | typeof versions[number];

const enum DbVersion {
  V1,
  V2,
}

const v1 = (db: sqlite3.Database) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
  );
};

const v2 = (db: sqlite3.Database) => {
  console.log("v2");
};

const VerionResolvers: Record<DbVersion, (db: sqlite3.Database) => void> = {
  [DbVersion.V1]: v1,
  [DbVersion.V2]: v2,
};

// sqlite> SELECT count(name) FROM sqlite_master WHERE type='table' AND name='Singletons';
// 1
// sqlite> SELECT count(name) FROM sqlite_master WHERE type='table' AND name='Singletonsa';
// 0

// sqlite> SELECT COUNT(*) AS CNTREC FROM pragma_table_info('Singletons') WHERE name='column_name';
// 0
// sqlite> SELECT COUNT(*) AS CNTREC FROM pragma_table_info('Singletons') WHERE name='Key';
// 1
// sqlite> 

// sqlite> ALTER TABLE Singletons ADD COLUMN foo TEXT default null 
//    ...> ;
// sqlite> SELECT * FRPM Singletons;
// Parse error: near "FRPM": syntax error
//   SELECT * FRPM Singletons;
//            ^--- error here
// sqlite> SELECT * FROM Singletons;
// password|$2b$10$Iv6g1n5Xc3aPmfV89az/feauyQIgA.dB/apymaaj88XihOIz4fL3q|
// sqlite> ALTER TABLE Singletons ADD COLUMN foo TEXT default null;
// Parse error: duplicate column name: foo
// sqlite> 


// SELECT CASE (SELECT count(*) FROM pragma_table_info(''product'') c WHERE c.name = ''purchaseCopy'') WHEN 0 THEN ALTER TABLE product ADD purchaseCopy BLOB END

export type Database = {
  path?: string;
  version?: DatabaseVersion;
};

export const getDatabase = ({
  path = DB_PATH,
  version = "latest",
}: Database = {}) => {
  const db = new sqlite.Database(path);
  console.log(VerionResolvers);

  db.run(
    `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
  );

  return db;
};
