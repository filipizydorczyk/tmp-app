import { TaskRepository } from "@tmp/back/repositories/task-repo";
import { TaskDTO } from "@tmp/back/dto";
import { isIsoDate } from "@tmp/back/util";

export const useTaskService = (repository: TaskRepository) => {
    const {
        getAllTasks,
        deleteTask: deleteTaskFromDb,
        updateTask: updateTaskInDb,
        createTask: createTaskInDb,
    } = repository;

    const getTasks = async (): Promise<TaskDTO[]> => {
        const allTasks = await getAllTasks();
        return Promise.all(
            allTasks.map((task) => {
                return {
                    id: task.Id,
                    title: task.Title,
                    date: isIsoDate(task.Date) ? task.Date : "",
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
            Date: isIsoDate(task.date) ? task.date : "",
            Done: task.done ? 1 : 0,
        });
    };
    const createTask = (task: TaskDTO) => {
        return createTaskInDb({
            Id: "",
            Title: task.title,
            Done: task.done ? 1 : 0,
            Date: isIsoDate(task.date) ? task.date : "",
        });
    };

    return { getTasks, deleteTask, updateTask, createTask };
};

export default useTaskService;
