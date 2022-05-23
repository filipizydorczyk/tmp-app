import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SingletonService } from "@tmp/back/services/singleton-service";
import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";
import { AppDependencies } from "@tmp/back/app";

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

export type Security = {
    login: (password: string) => Promise<SecurityResponse>;
    refresh: (token: string) => Promise<SecurityResponse>;
    validate: (accessToken: string) => Promise<boolean>;
    logout: (refreshToken: string) => boolean;
    clearRefreshTokens: () => Promise<string[]>;
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
): Security => {
    let refreshTokens: string[] = tokens || [];

    /**
     * Funciton to validate if provided refresh token is valid.
     * Should be used in refresh token function to check if
     * token even if exists could exist in first place. This
     * function should be used only in this modue and should
     * not be exported
     * @param refreshToken to validate
     * @returns boolean if token is valid or not
     */
    const validateRefreshToken = (refreshToken: string): Promise<boolean> => {
        return new Promise((resolve, _) => {
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, _) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    };

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
                expiresIn: "1m",
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
    const refresh = async (token: string): Promise<SecurityResponse> => {
        const isValid = await validateRefreshToken(token);
        if (!refreshTokens.includes(token) || !isValid) {
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

    /**
     * Function clear refresh token array. It will delete all tokens
     * that are not longer valid
     */
    const clearRefreshTokens = async () => {
        const newTokenArray: string[] = [];

        for (const token of refreshTokens) {
            const isValid = await validateRefreshToken(token);

            if (isValid) {
                newTokenArray.push(token);
            }
        }

        refreshTokens = newTokenArray;

        return refreshTokens;
    };

    return { login, refresh, validate, logout, clearRefreshTokens };
};

/**
 * Koa Router Middleware that you can use to require
 * authorization on your endpoints.
 * @param ctx context to set responses statuses
 * @param next will be called if user was successfully authorzied
 */
export const validateToken: Router.Middleware<
    DefaultState,
    DefaultContext
> = async (ctx, next) => {
    const { validate } = (ctx.dependencies as AppDependencies).security;
    const authHeader = ctx.req.headers["authorization"];
    if (!authHeader) {
        ctx.status = 400;
        return;
    }
    const token = authHeader.split(" ")[1];
    const result = await validate(token);
    if (result) {
        await next();
    } else {
        ctx.status = 403;
        return;
    }
};

export default useSecurity;
