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

    /**
     * Function to get all tasks in database
     * @returns list of all tasks dto
     */
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

    /**
     * Function to delted task with given id
     * @param id of task to be removed from db
     * @returns boolen if operation was successful
     */
    const deleteTask = (id: string): Promise<boolean> => {
        return deleteTaskFromDb(id);
    };

    /**
     * Function to update task with dto
     * @param task dto with values to be updated. Id in
     * dto will be used to define task to be updated
     *
     * @returns boolen if operation was successful
     */
    const updateTask = (task: TaskDTO): Promise<boolean> => {
        return updateTaskInDb({
            Id: task.id,
            Title: task.title,
            Date: isIsoDate(task.date) ? task.date : "",
            Done: task.done ? 1 : 0,
        });
    };

    /**
     * Function to create new task
     * @param task dto to be inserted to database. Id will be
     * generated by reporitory even if you provide any in dto
     *
     * @returns
     */
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
