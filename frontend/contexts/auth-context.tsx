import React, { useState, createContext, ReactNode, useContext } from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";

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
    refresh: () => Promise<boolean>;
};

type AuthProviderProps = {
    children: ReactNode;
};

const defaultError = { message: "", isError: false };

const defaulAuthContextProps = {
    data: { isLoggedIn: false, accessToken: null, refreshToken: null },
    error: defaultError,
    closeError: () => {},
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
    refresh: () => Promise.resolve(false),
};

const AuthContext = createContext<AuthContextProps>(defaulAuthContextProps);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthData>(defaulAuthContextProps.data);
    const [error, setError] = useState<AuthError>(defaultError);
    const { logIn: logInCall, refreshToken } = useApiClient();

    /**
     * Function to obtain backend authorization data.
     * If operation will fail it will also set error
     * message to be displayed
     *
     * @param password password for the app
     * @returns if operation was sucessfull
     */
    const logIn = (password: string) => {
        return new Promise<boolean>(async (resolve, _) => {
            logInCall(password)
                .then((creds) => {
                    if (creds.accessToken !== null) {
                        setData({
                            isLoggedIn: creds.accessToken !== null,
                            accessToken: creds.accessToken,
                            refreshToken: creds.refreshToken,
                        });
                        resolve(true);
                    } else {
                        setError({ isError: true, message: creds.message });
                        resolve(false);
                    }
                })
                .catch((error) => {
                    setError({ isError: true, message: error });
                    resolve(false);
                });
        });
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

    /**
     * Function to refresh tokens
     * @returns if operation was sucessfull
     */
    const refresh = async (): Promise<boolean> => {
        if (data.accessToken) {
            const response = await refreshToken(data.accessToken);
            if (response.accessToken) {
                setData({
                    isLoggedIn: true,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
                return Promise.resolve(true);
            } else {
                setData({
                    isLoggedIn: false,
                    accessToken: null,
                    refreshToken: null,
                });
                setError({ message: response.message, isError: true });
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(false);
    };

    return (
        <AuthContext.Provider
            value={{ error, data, logIn, logOut, closeError, refresh }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider };
