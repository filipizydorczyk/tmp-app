import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";
import useTokensSession from "@tmp/front/hooks/useTokensSession";

type AuthError = {
    message: string;
    isError: boolean;
};

type AuthData = {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
};

type AuthContextProps = {
    data: AuthData;
    error: AuthError;
    closeError: () => void;
    logIn: (password: string) => Promise<boolean>;
    logOut: () => Promise<boolean>;
};

type AuthProviderProps = {
    children: ReactNode;
};

const defaultError = { message: "", isError: false };
const defaultData = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
};
const defaulAuthContextProps = {
    data: defaultData,
    error: defaultError,
    closeError: () => {},
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
};

const AuthContext = createContext<AuthContextProps>(defaulAuthContextProps);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthData>(defaulAuthContextProps.data);
    const [error, setError] = useState<AuthError>(defaultError);
    const { tokens, updateTokens } = useTokensSession();
    const { logIn: logInCall } = useApiClient();

    useEffect(() => {
        if (
            tokens.accessToken !== data.accessToken &&
            tokens.refreshToken !== data.refreshToken
        ) {
            setData({
                isLoggedIn: tokens.accessToken !== null,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        }
    }, [tokens]);

    /**
     * Function to obtain backend authorization data.
     * If operation will fail it will also set error
     * message to be displayed
     *
     * @param password password for the app
     * @returns if operation was sucessfull
     */
    const logIn = async (password: string) => {
        const response = await logInCall(password).catch((err) => {
            setError({ isError: true, message: "Something went wrong!" });
        });

        if (response?.status === 200) {
            updateTokens(response.data);
        }

        return Promise.resolve(response?.status === 200);
    };

    /**
     * Removes auth data and call endpoint to clear session
     * @returns if operation was sucessfull
     */
    const logOut = () => Promise.resolve(false);

    /**
     * Function to clear error message
     */
    const closeError = () => {
        setError(defaultError);
    };

    return (
        <AuthContext.Provider
            value={{ error, data, logIn, logOut, closeError }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider };
