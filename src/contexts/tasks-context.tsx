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
};

const TaskContext = createContext<TaskContextProps>(defaulAuthContextProps);

const TaskProvider = ({ children }: TaskProviderProps) => {
    const [data, setData] = useState<Page<TaskDTO>>(
        defaulAuthContextProps.data
    );
    const { getTasks } = useApiClient();

    useEffect(() => {
        getTasks().then((response) => {
            setData(response);
        });
    }, []);

    return (
        <TaskContext.Provider value={{ data }}>{children}</TaskContext.Provider>
    );
};

const useTasks = () => {
    return useContext(TaskContext);
};

export { useTasks, TaskProvider };
