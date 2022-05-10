import { TaskEntity, TaskRepository } from "@tmp/back/repositories/task-repo";
import { TaskDTO } from "@tmp/back/dto";

export const useTaskService = (repository: TaskRepository) => {
    const { getAllTasks, deleteTask: deleteTaskFromDb } = repository;

    const getTasks = (): Promise<TaskEntity[]> => {
        return getAllTasks();
    };
    const deleteTask = (id: string): Promise<boolean> => {
        return deleteTaskFromDb(id);
    };
    const updateTask = (task: TaskDTO) => {};
    const createTask = (task: TaskDTO) => {};

    return { getTasks, deleteTask, updateTask, createTask };
};

export default useTaskService;
