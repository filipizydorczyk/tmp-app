import { LoginDTO, NotesDTO, TaskDTO, NewTaskDTO } from "@tmp/back/dto";
import { Page } from "@tmp/back/utils";
import Axios from "axios";
import useAxiosInterceptors from "@tmp/front/hooks/useAxiosInterceptors";

const BACKEND_URL = window.__RUNTIME_CONFIG__.API_URL;

/**
 * Custom hook to make backend requests.
 * @returns functions to make authorized REST API requests
 */
const useApiClient = () => {
    let axiosApiInstance = Axios.create();

    /**
     * Funtion to obtain accessToken and refreshToken from backend
     * @param password for the app required to get creds
     * @returns object containing cred inforations
     */
    const logIn = (password: string) => {
        return axiosApiInstance.post<LoginDTO>(`${BACKEND_URL}/token/login`, {
            password: password,
        });
    };

    /**
     * Function to refresh token
     * @param token refresh token
     * @returns new set of tokens
     */
    const refreshToken = (token: string) => {
        return axiosApiInstance.post<LoginDTO>(`${BACKEND_URL}/token/refresh`, {
            refreshToken: token,
        });
    };

    /**
     * Function to fetch notes. For no no authorization is required
     * but it will be in future
     * @returns dto conatining notes
     */
    const getNotes = () => {
        return axiosApiInstance.get<NotesDTO>(`${BACKEND_URL}/notes`);
    };

    /**
     * Funtion to save notes in database
     * @param notes sring to ba saved in backend app
     * @returns updated notes dto
     */
    const saveNotes = (notes: string) => {
        return axiosApiInstance.post<NotesDTO>(`${BACKEND_URL}/notes`, {
            content: notes,
        } as NotesDTO);
    };

    /**
     * Function call api creation endpoint
     * @param data dto with data to create task
     * @returns dto of created task
     */
    const createTask = (data: NewTaskDTO) => {
        return axiosApiInstance.post<TaskDTO>(`${BACKEND_URL}/tasks`, data);
    };

    /**
     * Funciton to get tasks from database
     * @returns paginated list of tasks
     */
    const getTasks = () => {
        return axiosApiInstance.get<Page<TaskDTO>>(`${BACKEND_URL}/tasks`);
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
            const resp = axiosApiInstance.put(`${BACKEND_URL}/tasks`, data);
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
            const resp = axiosApiInstance.delete(`${BACKEND_URL}/tasks/${id}`);
            resp.then((val) => {
                resolve(val.data);
            });
            resp.catch((er) => {
                rejects(er);
            });
        });
    };

    axiosApiInstance = useAxiosInterceptors({
        axios: axiosApiInstance,
        refreshToken,
    });

    return {
        logIn,
        getNotes,
        saveNotes,
        getTasks,
        updateTask,
        deleteTask,
        createTask,
        refreshToken,
    };
};

export default useApiClient;
