import { AxiosInstance, AxiosResponse } from "axios";
import useTokensSession from "@tmp/front/hooks/useTokensSession";
import { LoginDTO } from "@tmp/back/dto";

type CreateInterceptorsProps = {
    axios: AxiosInstance;
    refreshToken: (token: string) => Promise<AxiosResponse<LoginDTO, any>>;
};

const createInterceptors = ({
    axios,
    refreshToken,
}: CreateInterceptorsProps) => {
    const { getUpToDateTokens, updateTokens } = useTokensSession();

    axios.interceptors.request.use(
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
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            if (
                error.response &&
                error.response.status === 403 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                const { refreshToken: refreshTokenFromSession } =
                    getUpToDateTokens();

                if (refreshTokenFromSession) {
                    const response = await refreshToken(
                        refreshTokenFromSession
                    ).catch(() => {
                        updateTokens({
                            accessToken: null,
                            refreshToken: null,
                        });
                    });
                    if (response) {
                        updateTokens(response.data);
                    }
                }
                return axios(originalRequest);
            }
            return Promise.reject(error);
        }
    );

    return axios;
};

export default createInterceptors;
