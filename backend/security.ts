import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");

export type TokenResponse = {
    accessToken: string | null;
    refreshToken: string | null;
};

/**
 * Functions to manage tokens to authorize app access
 * @returns ready object that contains functions to
 * manage tokens
 */
export const useSecurity = () => {
    let refreshTokens: string[] = [];

    /**
     * Function to obtain access and refresh tokens and
     * remember refresh token to future operations
     * @param password to create tokens from
     * @returns accessToken and refreshToken
     */
    const login = (password: string): TokenResponse => {
        const accessToken = jwt.sign({ password }, ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ password }, REFRESH_TOKEN_SECRET, {
            expiresIn: "20m",
        });
        refreshTokens.push(refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    };

    /**
     * Function to clear refresh token and in consequence
     * stop authorizing requests with this token
     * @param token refresh token to be removed
     * @returns if operation was successful
     */
    const logout = (token: string): boolean => {
        return false;
    };

    /**
     * Function to refresh expired token
     * @param token refresh token to be used
     * @returns accessToken and refreshToken
     */
    const refresh = (token: string): TokenResponse => {
        if (!refreshTokens.includes(token)) {
            return { accessToken: null, refreshToken: null };
        }
        refreshTokens = refreshTokens.filter((tk) => tk !== token);

        return { accessToken: null, refreshToken: null };
    };

    return { login, logout, refresh };
};

export default useSecurity;
