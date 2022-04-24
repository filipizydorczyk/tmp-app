import React, { useState, createContext, ReactNode } from "react";

type AuthData = {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
};

type AuthContextProps = {
    data: AuthData;
    logIn: (password: string) => Promise<boolean>;
    logOut: () => Promise<boolean>;
};

type AuthProviderProps = {
    children: ReactNode;
};

const defaulAuthContextProps = {
    data: { isLoggedIn: false, accessToken: null, refreshToken: null },
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
};

const AuthContext = createContext<AuthContextProps>(defaulAuthContextProps);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthData>(defaulAuthContextProps.data);

    /**
     * Function to obtain backend authorization data
     * @param password password for the app
     * @returns if operation was sucessfull
     */
    const logIn = (password: string) => Promise.resolve(false);

    /**
     * Removes auth data and call endpoint to clear session
     * @returns if operation was sucessfull
     */
    const logOut = () => Promise.resolve(false);

    return (
        <AuthContext.Provider value={{ data, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// USE AUTH

// export { useAuth, AuthProvider}
