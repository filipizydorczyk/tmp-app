import uuid4 from "uuid4";
import fs from "fs";
import assert from "assert";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import path from "path";

describe(`SingletonRepository integration tests`, async () => {
    it("password flow", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);

        const repo = useSingletonRepository(dbPath);

        let password = await repo.getPassword();
        let result = false;
        assert.deepEqual(password, null);

        result = await repo.setPassword("first-passwd");
        password = await repo.getPassword();
        assert.deepEqual(true, result);
        assert.deepEqual(password, "first-passwd");

        result = false;

        result = await repo.changePassword("second-passwd");
        password = await repo.getPassword();
        assert.deepEqual(true, result);
        assert.deepEqual(password, "second-passwd");

        fs.rmSync(dbPath);
    });

    it("notes flow", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);

        const repo = useSingletonRepository(dbPath);

        let notes = await repo.getNotes();
        let result = false;
        assert.deepEqual(notes, null);

        result = await repo.setNotes("First note!");
        notes = await repo.getNotes();
        assert.deepEqual(true, result);
        assert.deepEqual(notes, "First note!");

        result = false;

        result = await repo.updateNotes("Second note!");
        notes = await repo.getNotes();
        assert.deepEqual(true, result);
        assert.deepEqual(notes, "Second note!");

        fs.rmSync(dbPath);
    });
});
