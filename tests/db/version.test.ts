/* eslint-disable jest/valid-describe-callback */
import assert from "assert";
import sqlite3 from "sqlite3";
import path from "path";
import uuid4 from "uuid4";
import { execute, fetch } from "@tmp/back/utils";
import {
    getDatabase,
    SINGLETON_TABLE_NAME,
    TASK_TABLE_NAME,
} from "@tmp/back/db";
import { DbVersion, getVersion, VerionResolvers } from "@tmp/back/db/version";
import fs from "fs";

const sqlite = sqlite3.verbose();

const countVersion = async (db: sqlite3.Database) => {
    const v = await fetch(
        db,
        `SELECT COUNT(*) FROM Singletons WHERE Key='version'`
    );
    return Number(v["COUNT(*)"]);
};

describe("Database versioning integration tests", async () => {
    it("legacy database version compatibility", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const db = new sqlite.Database(dbPath);

        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS ${SINGLETON_TABLE_NAME} (Key TEXT NOT NULL, Value TEXT NOT NULL)`
        );
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS ${TASK_TABLE_NAME} (Id TEXT NOT NULL, Title TEXT NOT NULL, Date TEXT NOT NULL, Done INTEGER NOT NULL)`
        );

        const response = await getVersion(db);

        assert.deepEqual(response, DbVersion.V0);
        fs.rmSync(dbPath);
    });

    it("should return v0 version when no table present yet", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const db = new sqlite.Database(dbPath);

        const response = await getVersion(db);

        assert.deepEqual(response, DbVersion.V0);

        fs.rmSync(dbPath);
    });

    it("should return v1 version", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const db = new sqlite.Database(dbPath);

        await VerionResolvers[DbVersion.V0](db);

        const response = await getVersion(db);
        const count = await countVersion(db);

        assert.deepEqual(response, DbVersion.V1);
        assert.deepEqual(count, 1);

        fs.rmSync(dbPath);
    });

    it("should return v2 version", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const db = new sqlite.Database(dbPath);

        await VerionResolvers[DbVersion.V0](db);
        await VerionResolvers[DbVersion.V1](db);

        const response = await getVersion(db);
        const count = await countVersion(db);

        const columns = Number(
            (
                await fetch(
                    db,
                    `SELECT COUNT(*) FROM PRAGMA_TABLE_INFO('${TASK_TABLE_NAME}')`
                )
            )["COUNT(*)"]
        );
        const todayColumns = Number(
            (
                await fetch(
                    db,
                    `SELECT COUNT(*) FROM PRAGMA_TABLE_INFO('${TASK_TABLE_NAME}') WHERE name='Today'`
                )
            )["COUNT(*)"]
        );
        const colorColumns = Number(
            (
                await fetch(
                    db,
                    `SELECT COUNT(*) FROM PRAGMA_TABLE_INFO('${TASK_TABLE_NAME}') WHERE name='Color'`
                )
            )["COUNT(*)"]
        );

        assert.deepEqual(response, DbVersion.V2);
        assert.deepEqual(count, 1);
        assert.deepEqual(columns, 6);
        assert.deepEqual(todayColumns, 1);
        assert.deepEqual(colorColumns, 1);

        fs.rmSync(dbPath);
    });

    it("should update databse to newset version", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const db = new sqlite.Database(dbPath);
        const versionBefore = await getVersion(db);

        await getDatabase({ path: dbPath });

        const versionAfter = await getVersion(db);
        const count = await countVersion(db);

        assert.deepEqual(versionBefore, DbVersion.V0);
        assert.deepEqual(versionAfter, DbVersion.V2);
        assert.deepEqual(count, 1);
    });
});
