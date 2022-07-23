/* eslint-disable jest/valid-describe-callback */
import assert from "assert";
import sqlite3 from "sqlite3";
import path from "path";
import uuid4 from "uuid4";
import { execute } from "@tmp/back/utils";
import { SINGLETON_TABLE_NAME, TASK_TABLE_NAME } from "@tmp/back/db";
import { DbVersion, getVersion, VerionResolvers } from "@tmp/back/db/version";
import fs from "fs";

const sqlite = sqlite3.verbose();

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

    assert.deepEqual(response, null);
    
    fs.rmSync(dbPath);
  });

  it("should return null version when no table present yet", async () => {
    const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
    const db = new sqlite.Database(dbPath);

    const response = await getVersion(db);

    assert.deepEqual(response, null);
    
    fs.rmSync(dbPath);
  });

  it("should return v1 version", async () => {
    const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
    const db = new sqlite.Database(dbPath);

    await VerionResolvers[DbVersion.V1](db);

    const response = await getVersion(db);

    assert.deepEqual(response, DbVersion.V1);
    
    fs.rmSync(dbPath);
  });

});
