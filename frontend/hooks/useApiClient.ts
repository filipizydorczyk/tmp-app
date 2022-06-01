import { LoginDTO, NotesDTO, TaskDTO, NewTaskDTO } from "@tmp/back/dto";
import { Page } from "@tmp/back/utils";
import Axios from "axios";
import useTokensSession from "@tmp/front/hooks/useTokensSession";

/**
 * For now app considers only docker builds and development mode.
 * I am thinking about way to let user configure base `URL` for
 * already built app.
 */
const BACKEND_URL =
    process.env.NODE_ENV == "development"
        ? "http://localhost:8080/api/v1"
        : "backend";

/**
 * Custom hook to make backend requests. Its important to
 * use it inside `AuthProvider` because this hook uses it
 * to create authorization header
 * @returns functions to make REST API requests
 */
const useApiClient = () => {
    const { getUpToDateTokens, updateTokens } = useTokensSession();
    const axiosApiInstance = Axios.create();

    axiosApiInstance.interceptors.request.use(
        async (config) => {
            const { accessToken } = getUpToDateTokens();
            config.headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            };
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );

    /**
     * Funtion to obtain accessToken and refreshToken from backend
     * @param password for the app required to get creds
     * @returns object containing cred inforations
     */
    const logIn = (password: string) => {
        return new Promise<LoginDTO>((resolve, _) => {
            const resp = axiosApiInstance.post(`${BACKEND_URL}/token/login`, {
                password: password,
            });
            resp.then((val) => {
                const response = val.data as LoginDTO;
                updateTokens({
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
                resolve(response);
            });
            resp.catch((er) => {
                updateTokens({
                    accessToken: null,
                    refreshToken: null,
                });
                resolve(er.response.data as LoginDTO);
            });
        });
    };

    /**
     * Function to refresh token
     * @param token refresh token
     * @returns new set of tokens
     */
    const refreshToken = (token: string) => {
        return new Promise<LoginDTO>((resolve, _) => {
            const resp = axiosApiInstance.post(`${BACKEND_URL}/token/refresh`, {
                refreshToken: token,
            });
            resp.then((val) => {
                const response = val.data as LoginDTO;
                updateTokens({
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
                resolve(response);
            });
            resp.catch((er) => {
                updateTokens({
                    accessToken: null,
                    refreshToken: null,
                });
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
            const resp = axiosApiInstance.get(`${BACKEND_URL}/notes`);
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
            const resp = axiosApiInstance.post(`${BACKEND_URL}/notes`, {
                content: notes,
            } as NotesDTO);
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
            const resp = axiosApiInstance.post(`${BACKEND_URL}/tasks`, data);
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
            const resp = axiosApiInstance.get(`${BACKEND_URL}/tasks`);
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

    axiosApiInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;
                const { refreshToken: refreshTokenFromSession } =
                    getUpToDateTokens();
                if (refreshTokenFromSession) {
                    await refreshToken(refreshTokenFromSession);
                }
                return axiosApiInstance(originalRequest);
            }
            return Promise.reject(error);
        }
    );

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
