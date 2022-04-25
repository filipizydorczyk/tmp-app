import jwt from "jsonwebtoken";
import Router from "@koa/router";
import { API_VERSION } from "@tmp/back/routes";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import bodyParser from "koa-bodyparser";

const router = new Router({ prefix: `${API_VERSION}/token` });

export type LoginDTO = {
    message: string;
    accessToken: string | null;
    refreshToken: string | null;
};

router.post("/login", bodyParser(), async (ctx) => {
    const repository = useSingletonRepository();
    const { getPassword, setPassword, comparePasswords } =
        useSingletonService(repository);
    const currentPassword = await getPassword();
    const providedPassword = ctx.request.body.password;

    let responseStatus = 401;

    if (currentPassword === null) {
        const isPasswordSet = await setPassword(providedPassword);
        responseStatus = isPasswordSet ? 200 : 401;
    } else {
        const result = await comparePasswords(providedPassword);
        responseStatus = result ? 200 : 401;
    }

    // TODO process.env.REFRESH_TOKEN_SECRET

    ctx.status = responseStatus;
    ctx.body = {
        message:
            responseStatus === 401
                ? "Provided password was not correct"
                : "Successfully loged in!",
        accessToken:
            responseStatus === 200
                ? jwt.sign(providedPassword, "I-will-add-token-here", {
                      expiresIn: "15m",
                  })
                : null,
        refreshToken:
            responseStatus === 200
                ? jwt.sign(providedPassword, "I-will-add-token-here", {
                      expiresIn: "20m",
                  })
                : null,
    } as LoginDTO;
});

export default router;
