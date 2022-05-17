import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SingletonService } from "@tmp/back/services/singleton-service";

/**
 * Username is hardcoded here since there is single user for whole app
 * and because of that database doesn't store its username
 */
const USER = "admin";
const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");

export type TokenResponse = {
    accessToken: string | null;
    refreshToken: string | null;
};

export type SecurityResponseType = "login" | "create" | "refuse" | "refresh";

export type SecurityResponse = {
    type: SecurityResponseType;
    tokens: TokenResponse;
};

/**
 * Functions to manage tokens to authorize app access
 *
 * @param singletonService singleton service to
 * operate with password
 * @param tokens list of tokens to be stored initially.
 * Do not use it in the actuall app just in tests when
 * test scenario assume some sort of initial state
 * @returns ready object that contains functions to
 * manage tokens
 */
export const useSecurity = (
    singletonService: SingletonService,
    tokens?: string[]
) => {
    let refreshTokens: string[] = tokens || [];

    /**
     * Function to login with credentials
     * @param password password to be verified. If password waws
     * never provided and service will retrun null provided
     * password will became a new password
     * @returns type of performed operation and
     * tokens to validation
     */
    const login = async (password: string): Promise<SecurityResponse> => {
        const { getPassword, setPassword, comparePasswords } = singletonService;
        const currentPassword = await getPassword();
        let type: SecurityResponseType = "refuse";

        if (currentPassword === null) {
            const result = await setPassword(password);
            type = result ? "create" : "refuse";
        } else {
            const result = await comparePasswords(password);
            type = result ? "login" : "refuse";
        }

        if (type === "login" || type === "create") {
            const accessToken = jwt.sign({ user: USER }, ACCESS_TOKEN_SECRET, {
                expiresIn: "15m",
            });
            const refreshToken = jwt.sign(
                { user: USER },
                REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "20m",
                }
            );
            refreshTokens.push(refreshToken);

            return {
                type,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            };
        }

        return {
            type,
            tokens: {
                accessToken: null,
                refreshToken: null,
            },
        };
    };

    /**
     * Function to refresh token
     * @param token (refreh) to authorize refresh request
     * @returns type of performed operation and new tokens
     */
    const refresh = (token: string): SecurityResponse => {
        if (!refreshTokens.includes(token)) {
            return {
                type: "refuse",
                tokens: { accessToken: null, refreshToken: null },
            };
        }
        refreshTokens = refreshTokens.filter((tk) => tk !== token);

        return {
            type: "refresh",
            tokens: {
                accessToken: jwt.sign({ user: USER }, ACCESS_TOKEN_SECRET, {
                    expiresIn: "15m",
                }),
                refreshToken: jwt.sign({ user: USER }, REFRESH_TOKEN_SECRET, {
                    expiresIn: "20m",
                }),
            },
        };
    };

    /**
     * Function to validate token. It should be used in
     * routes that are supposed to be restricted
     * @param accessToken to be validated
     * @returns boolean if token was validated
     */
    const validate = (accessToken: string): Promise<boolean> => {
        return new Promise((resolve, _) => {
            jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, _) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    };

    /**
     * Function to logout from app. It will me remove refresh
     * token from memory so that you can't refresh token anymore
     * @param refreshToken to be removed
     * @returns boolean if token was removed
     */
    const logout = (refreshToken: string): boolean => {
        if (refreshTokens.includes(refreshToken)) {
            refreshTokens = refreshTokens.filter((c) => c != refreshToken);
            return true;
        }
        return false;
    };

    return { login, refresh, validate, logout };
};

export default useSecurity;
