import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { API_VERSION } from "@tmp/back/routes";

const router = new Router({ prefix: `${API_VERSION}/tasks` });

router.get("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
});
