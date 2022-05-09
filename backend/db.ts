import sqlite3 from "sqlite3";
import path from "path";

export const DB_PATH = path.join(__dirname, "../database.db");
export const SINGLETON_TABLE_NAME = "Singletons";
export const TASK_TABLE_NAME = "Tasks";

const sqlite = sqlite3.verbose();

export const getDatabase = () => {
    const db = new sqlite.Database(DB_PATH);

    db.run(
        `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
    );
    db.run(
        `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
    );

    return new sqlite.Database(DB_PATH);
};
