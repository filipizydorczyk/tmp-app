import { TaskEntity, TaskRepository } from "@tmp/back/repositories/task-repo";
import { TaskDTO } from "@tmp/back/dto";

export const useTaskService = (repository: TaskRepository) => {
    const getTasks = (): Promise<TaskEntity[]> => {
        return repository.getAllTasks();
    };
    const deleteTask = (id: string): Promise<boolean> => {
        return repository.deleteTask(id);
    };
    const updateTask = (task: TaskDTO) => {};
    const createTask = (task: TaskDTO) => {};

    return { getTasks, deleteTask, updateTask, createTask };
};

export default useTaskService;
