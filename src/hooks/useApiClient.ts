import { LoginDTO, NotesDTO, TaskDTO, NewTaskDTO } from "@tmp/back/dto";
import { Page } from "@tmp/back/utils";
import Axios, { AxiosRequestConfig } from "axios";

const BACKEND_URL = "http://localhost:8080/api/v1";

const requestHeaders = {
    headers: { "Content-Type": "application/json" },
} as AxiosRequestConfig;

const useApiClient = () => {
    /**
     * Funtion to obtain accessToken and refreshToken from backend
     * @param password for the app required to get creds
     * @returns object containing cred inforations
     */
    const logIn = (password: string) => {
        return new Promise<LoginDTO>((resolve, _) => {
            const resp = Axios.post(
                `${BACKEND_URL}/token/login`,
                {
                    password: password,
                },
                requestHeaders
            );
            resp.then((val) => {
                resolve(val.data as LoginDTO);
            });
            resp.catch((er) => {
                resolve(er.response.data as LoginDTO);
            });
        });
    };

    /**
     * Function to fetch notes. For no no authorization is required
     * but it will be in future
     * @returns dto conatining notes
     */
    const getNotes = () => {
        return new Promise<NotesDTO>((resolve, rejects) => {
            const resp = Axios.get(`${BACKEND_URL}/notes`, requestHeaders);
            resp.then((val) => {
                resolve(val.data as NotesDTO);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    /**
     * Funtion to save notes in database
     * @param notes sring to ba saved in backend app
     * @returns updated notes dto
     */
    const saveNotes = (notes: string) => {
        return new Promise<NotesDTO>((resolve, rejects) => {
            const resp = Axios.post(
                `${BACKEND_URL}/notes`,
                { content: notes } as NotesDTO,
                requestHeaders
            );
            resp.then((val) => {
                resolve(val.data as NotesDTO);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    /**
     * Function call api creation endpoint
     * @param data dto with data to create task
     * @returns dto of created task
     */
    const createTask = (data: NewTaskDTO) => {
        return new Promise<TaskDTO>((resolve, rejects) => {
            const resp = Axios.post(
                `${BACKEND_URL}/tasks`,
                data,
                requestHeaders
            );
            resp.then((val) => {
                resolve(val.data as TaskDTO);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    /**
     * Funciton to get tasks from database
     * @returns paginated list of tasks
     */
    const getTasks = () => {
        return new Promise<Page<TaskDTO>>((resolve, rejects) => {
            const resp = Axios.get(`${BACKEND_URL}/tasks`, requestHeaders);
            resp.then((val) => {
                resolve(val.data as Page<TaskDTO>);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    /**
     * Function to update existing task
     * @param data dto with data to be updated. `id` filed
     * will decide about task being updated
     *
     * @returns dto with updated data
     */
    const updateTask = (data: TaskDTO) => {
        return new Promise<TaskDTO>((resolve, rejects) => {
            const resp = Axios.put(
                `${BACKEND_URL}/tasks`,
                data,
                requestHeaders
            );
            resp.then((val) => {
                resolve(val.data as TaskDTO);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    /**
     * Function to delete task
     * @param id of task to be removed
     * @returns dto of deleted task
     */
    const deleteTask = (id: string) => {
        return new Promise<TaskDTO>((resolve, rejects) => {
            const resp = Axios.delete(
                `${BACKEND_URL}/tasks/${id}`,
                requestHeaders
            );
            resp.then((val) => {
                resolve(val.data);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    return {
        logIn,
        getNotes,
        saveNotes,
        getTasks,
        updateTask,
        deleteTask,
        createTask,
    };
};

export default useApiClient;
