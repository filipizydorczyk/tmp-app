/* eslint-disable jest/valid-describe-callback */
import assert from "assert";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import withDatabase from "../tests-utils";

describe(`SingletonRepository integration tests`, async () => {
    it("password flow", async () => {
        await withDatabase(async ({ path }) => {
            const repo = useSingletonRepository(path);

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
        });
    });

    it("notes flow", async () => {
        await withDatabase(async ({ path }) => {
            const repo = useSingletonRepository(path);

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
        });
    });
});
