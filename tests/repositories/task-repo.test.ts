import useTaskRepository, {
    TaskEntity,
} from "@tmp/back/repositories/task-repo";
import assert from "assert";
import uuid4 from "uuid4";
import withDatabase from "../tests-utils";

describe(`TaskRepository integration tests`, async () => {
    it("tasks flow", async () => {
        await withDatabase(async ({ path }) => {
            const repo = useTaskRepository(path);

            let count = await repo.getTotalTaskCount();
            assert.deepEqual(count, 0);

            const testTask = await repo.createTask({
                Id: "fake-id",
                Title: "Title",
                Date: new Date().toISOString(),
                Done: 0,
                Color: "",
                Today: 0,
            });
            count = await repo.getTotalTaskCount();
            assert.deepEqual(count, 1);

            let result = await repo.updateTask({
                Id: "fake-id",
                Title: "Title",
                Date: new Date().toISOString(),
                Done: 1,
                Color: "",
                Today: 0,
            });
            const allTasks = await repo.getAllTasks(0, 5);
            assert.deepEqual(result, true);
            assert.deepEqual(allTasks.content[0].Done, 1);
            result = false;

            result = await repo.deleteTask(testTask.Id);
            count = await repo.getTotalTaskCount();
            assert.deepEqual(result, true);
            assert.deepEqual(count, 0);
        });
    });

    it("should return all tasks result with correct order", async () => {
        await withDatabase(async ({ path }) => {
            const repo = useTaskRepository(path);

            const testTask: TaskEntity = {
                Id: "fake-id",
                Title: "Title",
                Date: new Date().toISOString(),
                Done: 0,
                Color: "",
                Today: 0,
            };

            await repo.createTask({ ...testTask, Id: uuid4() });
            await repo.createTask({
                ...testTask,
                Id: uuid4(),
                Color: "#ff76a2",
            });
            await repo.createTask({
                ...testTask,
                Id: uuid4(),
                Color: "#ff76a2",
            });
            // prettier-ignore
            await repo.createTask({ ...testTask, Id: uuid4(), Done: 1, Color: "#ff76a2"  });
            await repo.createTask({ ...testTask, Id: uuid4(), Done: 1 });
            await repo.createTask({ ...testTask, Id: uuid4(), Today: 1 });

            const allTasks = await repo.getAllTasks(0, 10);

            assert.deepEqual(allTasks.content[0].Color, "");
            assert.deepEqual(allTasks.content[0].Done, 0);

            assert.deepEqual(allTasks.content[1].Color, "#ff76a2");
            assert.deepEqual(allTasks.content[1].Done, 0);

            assert.deepEqual(allTasks.content[2].Color, "#ff76a2");
            assert.deepEqual(allTasks.content[2].Done, 0);

            assert.deepEqual(allTasks.content[3].Today, 1);
            assert.deepEqual(allTasks.content[4].Done, 1);
            assert.deepEqual(allTasks.content[5].Done, 1);
        });
    });
});
