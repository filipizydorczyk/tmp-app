import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";
import assert from "assert";
import sinon from "sinon";

const TEST_ID = "totally-not-fake-id";
const TEST_TITLE = "Test title";
const TEST_DATE = "2022-05-12T19:46:25.667Z";

describe.only("TaskService", () => {
    it("should return all tasks", async () => {
        const repository = useTaskRepository();
        sinon.stub(repository, "getAllTasks").returns(
            Promise.resolve({
                page: 0,
                size: 1,
                pages: 3,
                total: 5,
                content: [
                    {
                        Id: TEST_ID,
                        Title: TEST_TITLE,
                        Date: TEST_DATE,
                        Done: 0,
                    },
                ],
            })
        );
        const { getTasks } = useTaskService(repository);

        const reponse = await getTasks();
        assert.strictEqual(reponse.page, 0);
        assert.strictEqual(reponse.size, 1);
        assert.strictEqual(reponse.pages, 3);
        assert.strictEqual(reponse.total, 5);
        assert.strictEqual(reponse.content.length, 1);
        assert.strictEqual(reponse.content[0].date, TEST_DATE);
        assert.strictEqual(reponse.content[0].done, false);
        assert.strictEqual(reponse.content[0].id, TEST_ID);
        assert.strictEqual(reponse.content[0].title, TEST_TITLE);
    });

    it("should create task", async () => {
        assert.ok(false);
    });

    it("should update task", async () => {
        assert.ok(false);
    });

    it("should delete task", async () => {
        assert.ok(false);
    });
});
