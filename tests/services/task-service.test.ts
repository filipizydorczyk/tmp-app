import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";
import assert from "assert";
import sinon from "sinon";
import withDatabase from "../tests-utils";

const TEST_ID = "totally-not-fake-id";
const TEST_TITLE = "Test title";
const TEST_DATE = "2022-05-12T19:46:25.667Z";

describe("TaskService", () => {
    it("should return all tasks", async () => {
        withDatabase(async ({ path }) => {
            const repository = useTaskRepository(path);
            sinon
                .stub(repository, "getTotalTaskCount")
                .returns(Promise.resolve(2));
            const getTasksSpy = sinon.stub(repository, "getAllTasks").returns(
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
                            Color: "",
                            Today: 0,
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
            assert.strictEqual(getTasksSpy.callCount, 1);
        });
    });

    it("should create task", async () => {
        withDatabase(async ({ path }) => {
            const repository = useTaskRepository(path);
            const createTaskSpy = sinon.stub(repository, "createTask").returns(
                Promise.resolve({
                    Id: TEST_ID,
                    Title: TEST_TITLE,
                    Date: TEST_DATE,
                    Done: 1,
                    Color: "",
                    Today: 0,
                })
            );
            const { createTask } = useTaskService(repository);

            const reponse = await createTask({
                title: TEST_TITLE,
            });
            assert.strictEqual(reponse.id, TEST_ID);
            assert.strictEqual(reponse.title, TEST_TITLE);
            assert.strictEqual(reponse.date, TEST_DATE);
            assert.strictEqual(reponse.done, true);
            assert.strictEqual(createTaskSpy.callCount, 1);
        });
    });

    it("should update task", async () => {
        withDatabase(async ({ path }) => {
            const repository = useTaskRepository(path);
            const updateTaskSpy = sinon
                .stub(repository, "updateTask")
                .returns(Promise.resolve(true));
            const { updateTask } = useTaskService(repository);

            const reponse = await updateTask({
                id: TEST_ID,
                title: TEST_TITLE,
                date: TEST_DATE,
                done: true,
                today: false,
            });
            assert.strictEqual(reponse, true);
            assert.strictEqual(updateTaskSpy.callCount, 1);
        });
    });

    it("should delete task", async () => {
        withDatabase(async ({ path }) => {
            const repository = useTaskRepository(path);
            const deleteTaskSpy = sinon
                .stub(repository, "deleteTask")
                .returns(Promise.resolve(true));
            const { deleteTask } = useTaskService(repository);

            const reponse = await deleteTask(TEST_ID);
            assert.strictEqual(reponse, true);
            assert.strictEqual(deleteTaskSpy.callCount, 1);
        });
    });

    it("should renew all tasks done for today", async () => {
        withDatabase(async ({ path }) => {
            const repository = useTaskRepository(path);
            const updateSpy = sinon.stub(repository, "updateTask");
            sinon.stub(repository, "getDoneForToday").returns(
                Promise.resolve([
                    {
                        Id: TEST_ID,
                        Title: TEST_TITLE,
                        Date: TEST_DATE,
                        Done: 1,
                        Color: "",
                        Today: 0,
                    },
                    {
                        Id: TEST_ID,
                        Title: TEST_TITLE,
                        Date: TEST_DATE,
                        Done: 1,
                        Color: "",
                        Today: 0,
                    },
                ])
            );

            const { renewDoneForToday } = useTaskService(repository);

            await renewDoneForToday();

            assert.strictEqual(updateSpy.callCount, 2);
        });
    });
});
