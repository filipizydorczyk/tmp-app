import path from "path";
import sqlite3 from "sqlite3";
import uuid4 from "uuid4";
import fs from "fs";

type WithDatabaseArgs = { db: sqlite3.Database; path: string };
type WithDatabaseCallback = (args: WithDatabaseArgs) => Promise<void>;

const sqlite = sqlite3.verbose();

const withDatabase = async (callback: WithDatabaseCallback) => {
    const dbPath = path.join(__dirname, `./artifacts/${uuid4()}.db`);

    const db = new sqlite.Database(dbPath);

    await callback({ db, path: dbPath });

    fs.rmSync(dbPath);
};

export default withDatabase;
