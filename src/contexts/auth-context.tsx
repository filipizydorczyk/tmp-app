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

const AuthContext = createContext<AuthContextProps>({
    data: { isLoggedIn: false, accessToken: null, refreshToken: null },
    logIn: (password: string) => Promise.resolve(false),
    logOut: () => Promise.resolve(false),
});

// AUTH PROVIDER

// USE AUTH

// export { useAuth, AuthProvider}
