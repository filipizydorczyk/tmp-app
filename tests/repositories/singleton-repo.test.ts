import uuid4 from "uuid4";
import fs from "fs";
import assert from "assert";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import path from "path";

describe(`SingletonRepository integration tests`, async () => {
    it.only("password flow", async () => {
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
});
