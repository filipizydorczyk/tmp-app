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
    logIn: (password: string) => Promise<boolean>;
    logOut: () => Promise<boolean>;
    closeError: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

const defaultError = { message: "", isError: false };

const defaulAuthContextProps = {
    data: { isLoggedIn: false, accessToken: null, refreshToken: null },
    error: defaultError,
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
    closeError: () => {},
};

const AuthContext = createContext<AuthContextProps>(defaulAuthContextProps);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthData>(defaulAuthContextProps.data);
    const [error, setError] = useState<AuthError>(defaultError);
    const { logIn: logInCall } = useApiClient();

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
