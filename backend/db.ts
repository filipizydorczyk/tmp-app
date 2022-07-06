import sqlite3 from "sqlite3";
import path from "path";

export const DB_PATH =
    process.env.SQLITE_PATH || path.join(__dirname, "../database.db");
export const SINGLETON_TABLE_NAME = "Singletons";
export const TASK_TABLE_NAME = "Tasks";

const sqlite = sqlite3.verbose();

const versions = <const>["1.0"];

export type DatabaseVersion = "latest" | typeof versions[number];

export type Database = {
    path?: string;
    version?: DatabaseVersion;
};

export const getDatabase = ({
    path = DB_PATH,
    version = "latest",
}: Database = {}) => {
    const db = new sqlite.Database(path);

    db.run(
        `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
    );
    db.run(
        `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
    );

    return db;
};
