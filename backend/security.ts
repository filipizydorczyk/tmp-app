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
 * @returns ready object that contains functions to
 * manage tokens
 */
export const useSecurity = (singletonService: SingletonService) => {
    let refreshTokens: string[] = [];

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

    return { login, refresh };
};

export default useSecurity;
