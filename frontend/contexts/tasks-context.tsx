import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";
import { Page } from "@tmp/back/utils";
import { TaskDTO, NewTaskDTO } from "@tmp/back/dto";

type TaskError = {
    isError: boolean;
    message: string;
};

type TaskContextProps = {
    data: Page<TaskDTO>;
    error: TaskError;
    createTask: (data: NewTaskDTO) => Promise<boolean>;
    deleteTask: (data: TaskDTO) => Promise<boolean>;
    updateTask: (data: TaskDTO) => Promise<boolean>;
    closeError: () => void;
};

type TaskProviderProps = {
    children: ReactNode;
};

const defaultError = {
    message: "",
    isError: false,
};
const defaulAuthContextProps = {
    data: {
        page: 0,
        size: 0,
        pages: 0,
        total: 0,
        content: [],
    },
    error: defaultError,
    createTask: () => Promise.resolve(true),
    updateTask: () => Promise.resolve(true),
    deleteTask: () => Promise.resolve(true),
    closeError: () => {},
};

const TaskContext = createContext<TaskContextProps>(defaulAuthContextProps);

const TaskProvider = ({ children }: TaskProviderProps) => {
    const [data, setData] = useState<Page<TaskDTO>>(
        defaulAuthContextProps.data
    );
    const [error, setError] = useState<TaskError>(defaultError);
    const {
        getTasks,
        updateTask: updateTaskREST,
        deleteTask: deleteTaskREST,
        createTask: createTaskREST,
    } = useApiClient();

    /**
     * Function to fetch notes and set them. This function is
     * not exaported from this module it will be used after diffrent
     * actions to refetch data
     * @returns promise
     */
    const fetchTasks = async () => {
        const response = await getTasks().catch(() => {
            setError({
                isError: true,
                message: `Fetching tasks failed.`,
            });
        });

        if (response?.status === 200) {
            setData(response.data);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    /**
     * Function to create new task
     * @param data dto with data needed for task creation
     * @returns boolean if operation was successful or not
     */
    const createTask = async (data: NewTaskDTO) => {
        const response = await createTaskREST(data).catch(() => {
            setError({
                isError: true,
                message: "Creating new task failed.",
            });
        });

        if (response?.status === 200) {
            fetchTasks();
        }

        return Promise.resolve(response?.status === 200);
    };

    /**
     * Function to update task
     * @param data dto with data to be udpated. `id` field
     * will decide what task will be udpated
     * @returns boolean if operation was successful or not
     */
    const updateTask = async (data: TaskDTO): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            updateTaskREST(data)
                .then(() => fetchTasks())
                .catch((err) => {
                    setError({
                        isError: true,
                        message: `Updating task failed. ${err}`,
                    });
                    resolve(false);
                });
        });
    };

    /**
     * Function to delete tasks
     * @param data dto but only id is important. Task with id of
     * provided dto will be deleted prenamently
     * @returns boolean if operation was successful or not
     */
    const deleteTask = async (data: TaskDTO): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            deleteTaskREST(data.id)
                .then(() => fetchTasks())
                .catch((err) => {
                    setError({
                        isError: true,
                        message: `Deleting task failed. ${err}`,
                    });
                    resolve(false);
                });
        });
    };

    /**
     * Function to clear error messsage
     */
    const closeError = () => {
        setError(defaultError);
    };

    return (
        <TaskContext.Provider
            value={{
                data,
                updateTask,
                deleteTask,
                createTask,
                error,
                closeError,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

const useTasks = () => {
    return useContext(TaskContext);
};

export { useTasks, TaskProvider };
