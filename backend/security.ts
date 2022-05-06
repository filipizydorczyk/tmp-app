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
    const refreshTokens = [];

    /**
     * Function to obtain access and refresh tokens and
     * remember refresh token to future operations
     * @param password to create tokens from
     * @returns accessToken and refreshToken
     */
    const login = (password: string): TokenResponse => {
        return { accessToken: null, refreshToken: null };
    };

    /**
     * Function to clear refresh token and in consequence
     * stop authorizing requests with this token
     * @param refreshTokens token to be removed
     * @returns if operation was successful
     */
    const logout = (refreshTokens: string): boolean => {
        return false;
    };

    /**
     * Function to refresh expired token
     * @param refreshTokens token to be refreshed
     * @returns accessToken and refreshToken
     */
    const refresh = (refreshTokens: string): TokenResponse => {
        return { accessToken: null, refreshToken: null };
    };

    return { login, logout, refresh };
};

export default useSecurity;
