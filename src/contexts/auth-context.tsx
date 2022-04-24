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

const defaulAuthData = {
    data: { isLoggedIn: false, accessToken: null, refreshToken: null },
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
};

const AuthContext = createContext<AuthContextProps>(defaulAuthData);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthData>(defaulAuthData.data);

    const logIn = (password: string) => Promise.resolve(false);
    const logOut = () => Promise.resolve(false);

    return (
        <AuthContext.Provider value={{ data, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// USE AUTH

// export { useAuth, AuthProvider}
