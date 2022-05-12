import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";

describe.only("TaskService", () => {
    it("should return all tasks", async () => {
        const repository = useTaskRepository();
        const service = useTaskService(repository);

        const allTasks = await repository.getAllTasks(0, 2);
    });
});
