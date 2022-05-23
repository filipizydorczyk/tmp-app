import Router from "@koa/router";
import { API_VERSION } from "@tmp/back/routes";
import bodyParser from "koa-bodyparser";
import { AppDependencies } from "@tmp/back/app";
import { LoginDTO } from "@tmp/back/dto";

const router = new Router({ prefix: `${API_VERSION}/token` });

router.post("/login", bodyParser(), async (ctx) => {
    const { login } = (ctx.dependencies as AppDependencies).security;

    if (!ctx.request.body.password) {
        ctx.status = 400;
        ctx.body = {
            message: "Bad request! Missing body.",
            accessToken: null,
            refreshToken: null,
        } as LoginDTO;
        return;
    }

    const providedPassword = ctx.request.body.password;
    const result = await login(providedPassword);

    ctx.status = result.type === "refuse" ? 401 : 200;
    ctx.body = {
        message:
            result.type === "refuse"
                ? "Provided password was not correct"
                : "Successfully loged in!",
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
    } as LoginDTO;
});

router.post("/refresh", bodyParser(), async (ctx) => {
    const { refresh } = (ctx.dependencies as AppDependencies).security;
});

export default router;
