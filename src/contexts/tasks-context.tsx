import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";
import { Page } from "@tmp/back/util";
import { TaskDTO } from "@tmp/back/dto";

type TaskContextProps = {
    data: Page<TaskDTO>;
    updateTask: (data: TaskDTO) => void;
    deleteTask: (data: TaskDTO) => void;
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
    } = useApiClient();

    useEffect(() => {
        getTasks().then((response) => {
            setData(response);
        });
    }, []);

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
        <TaskContext.Provider value={{ data, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};

const useTasks = () => {
    return useContext(TaskContext);
};

export { useTasks, TaskProvider };