import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { API_VERSION } from "@tmp/back/routes";
import { AppDependencies } from "@tmp/back/app";

const router = new Router({ prefix: `${API_VERSION}/tasks` });

router.get("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { getTasks } = (ctx.dependencies as AppDependencies).taskService;
    const response = await getTasks();

    ctx.status = 200;
    ctx.body = response;
});

export default router;
