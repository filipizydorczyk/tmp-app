import { TaskRepository } from "@tmp/back/repositories/task-repo";
import { TaskDTO } from "@tmp/back/dto";

export const useTaskService = (repository: TaskRepository) => {
    const {
        getAllTasks,
        deleteTask: deleteTaskFromDb,
        updateTask: updateTaskInDb,
    } = repository;

    const getTasks = async (): Promise<TaskDTO[]> => {
        const allTasks = await getAllTasks();
        return Promise.all(
            allTasks.map((task) => {
                return {
                    id: task.Id,
                    title: task.Title,
                    date: new Date(task.Date),
                    done: !!task.Done,
                } as TaskDTO;
            })
        );
    };
    const deleteTask = (id: string): Promise<boolean> => {
        return deleteTaskFromDb(id);
    };
    const updateTask = (task: TaskDTO) => {
        return updateTaskInDb({
            Id: task.id,
            Title: task.title,
            Date: task.date.toISOString(),
            Done: task.done ? 1 : 0,
        });
    };
    const createTask = (task: TaskDTO) => {};

    return { getTasks, deleteTask, updateTask, createTask };
};

export default useTaskService;
