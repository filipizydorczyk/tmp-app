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
    updateTask: (data: TaskDTO) => void;
    deleteTask: (data: TaskDTO) => void;
    createTask: (data: NewTaskDTO) => void;
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
    createTask: () => {},
    updateTask: () => {},
    deleteTask: () => {},
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

    const createTask = async (data: NewTaskDTO) => {
        await createTaskREST(data);
        await getTasks().then((response) => {
            setData(response);
        });
    };

    const updateTask = async (data: TaskDTO) => {
        await updateTaskREST(data);
        await getTasks().then((response) => {
            setData(response);
        });
    };

    const deleteTask = async (data: TaskDTO) => {
        await deleteTaskREST(data.id);
        await getTasks().then((response) => {
            setData(response);
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
