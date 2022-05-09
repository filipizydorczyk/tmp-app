import { TaskEntity, TaskRepository } from "@tmp/back/repositories/task-repo";

const useTaskService = (repository: TaskRepository) => {
    const getTasks = (): Promise<TaskEntity[]> => {
        return repository.getAllTasks();
    };

    return { getTasks };
};

export default useTaskService;
