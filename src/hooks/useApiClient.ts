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

    return { logIn };
};

export default useApiClient;
