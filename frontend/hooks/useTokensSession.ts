import { useState } from "react";

export const TOKEN_SESSION = "session-tokens";

type AuthData = {
    accessToken: string | null;
    refreshToken: string | null;
};

/**
 * Function that lets u to get up to date token
 * information.
 * @returns elements that coresponds to session
 * tokens.
 *  - `tokens` is react state and should be
 * used whenever some events should happend when
 * tokens are refreshed.
 *  - `getUpToDateTokens` will return same value
 * as `tokens` but if tokens were just updated
 * it will return correct values quicker. It
 * should be used in places where you need
 * newest information and you can't wait for
 * react state to refresh it for you.
 *  - `updateTokens` - function to update session
 * with provided tokens
 */
const useTokensSession = () => {
    const [tokens, setTokens] = useState<AuthData>({
        accessToken: null,
        refreshToken: null,
    });
    const getUpToDateTokens = (): AuthData => {
        const sessionItem = sessionStorage.getItem(TOKEN_SESSION);
        return sessionItem
            ? (JSON.parse(sessionItem) as AuthData)
            : {
                  accessToken: null,
                  refreshToken: null,
              };
    };
    const updateTokens = (tokens: AuthData) => {
        setTokens(tokens);
        sessionStorage.setItem(TOKEN_SESSION, JSON.stringify(tokens));
    };

    return { tokens, getUpToDateTokens, updateTokens };
};

export default useTokensSession;
