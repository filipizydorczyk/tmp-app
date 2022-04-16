import sqlite3 from "sqlite3";
import path from "path";

export const DB_PATH = path.join(__dirname, "../database.db");
export const SINGLETON_TABLE_NAME = "Singletons";

const sqlite = sqlite3.verbose();

export const getDatabase = () => {
    const db = new sqlite.Database(DB_PATH);

    db.run(
        `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
    );

    return new sqlite.Database(DB_PATH);
};
