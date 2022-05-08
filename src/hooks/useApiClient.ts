import { NotesDTO } from "@tmp/back/routes/notes";
import { LoginDTO } from "@tmp/back/routes/token";
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

    return { logIn, getNotes, saveNotes };
};

export default useApiClient;
