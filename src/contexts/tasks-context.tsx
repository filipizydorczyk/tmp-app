import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";
import { Page } from "@tmp/back/util";
import { TaskDTO, NewTaskDTO } from "@tmp/back/dto";

type TaskContextProps = {
    data: Page<TaskDTO>;
    updateTask: (data: TaskDTO) => Promise<boolean>;
    deleteTask: (data: TaskDTO) => Promise<boolean>;
    createTask: (data: NewTaskDTO) => Promise<boolean>;
};

type TaskProviderProps = {
    children: ReactNode;
};

const defaulAuthContextProps = {
    data: {
        page: 0,
        size: 0,
        pages: 0,
        total: 0,
        content: [],
    },
    createTask: () => Promise.resolve(true),
    updateTask: () => Promise.resolve(true),
    deleteTask: () => Promise.resolve(true),
};

const TaskContext = createContext<TaskContextProps>(defaulAuthContextProps);

const TaskProvider = ({ children }: TaskProviderProps) => {
    const [data, setData] = useState<Page<TaskDTO>>(
        defaulAuthContextProps.data
    );
    const {
        getTasks,
        updateTask: updateTaskREST,
        deleteTask: deleteTaskREST,
        createTask: createTaskREST,
    } = useApiClient();

    useEffect(() => {
        getTasks().then((response) => {
            setData(response);
        });
    }, []);

    const createTask = async (data: NewTaskDTO): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            await createTaskREST(data).catch(() => resolve(false));
            await getTasks().then((response) => {
                setData(response);
                resolve(true);
            });
        });
    };

    const updateTask = async (data: TaskDTO): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            await updateTaskREST(data).catch(() => resolve(false));
            await getTasks().then((response) => {
                setData(response);
                resolve(true);
            });
        });
    };

    const deleteTask = async (data: TaskDTO): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            await deleteTaskREST(data.id).catch(() => resolve(false));
            await getTasks().then((response) => {
                setData(response);
                resolve(true);
            });
        });
    };

    return (
        <TaskContext.Provider
            value={{ data, updateTask, deleteTask, createTask }}
        >
            {children}
        </TaskContext.Provider>
    );
};

const useTasks = () => {
    return useContext(TaskContext);
};

export { useTasks, TaskProvider };
