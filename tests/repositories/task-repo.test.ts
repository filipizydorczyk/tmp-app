import useTaskRepository from "@tmp/back/repositories/task-repo";
import assert from "assert";
import path from "path";
import uuid4 from "uuid4";
import fs from "fs";

describe(`TaskRepository integration tests`, async () => {
    it("tasks flow", async () => {
        const dbPath = path.join(__dirname, `../artifacts/${uuid4()}.db`);
        const repo = useTaskRepository(dbPath);

        let count = await repo.getTotalTaskCount();
        assert.deepEqual(count, 0);

        const testTask = await repo.createTask({
            Id: "fake-id",
            Title: "Title",
            Date: new Date().toISOString(),
            Done: 0,
        });
        count = await repo.getTotalTaskCount();
        assert.deepEqual(count, 1);

        let result = await repo.updateTask({
            Id: "fake-id",
            Title: "Title",
            Date: new Date().toISOString(),
            Done: 1,
        });
        const allTasks = await repo.getAllTasks(0, 5);
        assert.deepEqual(result, true);
        assert.deepEqual(allTasks.content[0].Done, 1);
        result = false;

        result = await repo.deleteTask(testTask.Id);
        count = await repo.getTotalTaskCount();
        assert.deepEqual(result, true);
        assert.deepEqual(count, 0);

        fs.rmSync(dbPath);
    });
});
