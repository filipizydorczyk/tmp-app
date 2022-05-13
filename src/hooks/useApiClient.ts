import { LoginDTO, NotesDTO, TaskDTO } from "@tmp/back/dto";
import { Page } from "@tmp/back/util";
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
        return new Promise<LoginDTO>((resolve, rejects) => {
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
                rejects(er);
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

    return { logIn, getNotes, saveNotes, getTasks, updateTask, deleteTask };
};

export default useApiClient;
