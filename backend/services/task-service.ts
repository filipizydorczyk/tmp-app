import { TaskEntity, TaskRepository } from "@tmp/back/repositories/task-repo";
import { TaskDTO } from "@tmp/back/dto";

export const useTaskService = (repository: TaskRepository) => {
    const getTasks = (): Promise<TaskEntity[]> => {
        return repository.getAllTasks();
    };
    const deleteTask = (id: string) => {};
    const updateTask = (task: TaskDTO) => {};

    return { getTasks, deleteTask, updateTask };
};

export default useTaskService;
