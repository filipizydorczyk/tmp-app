import Router from "@koa/router";
import { API_VERSION } from "@tmp/back/routes";

const router = new Router({ prefix: `/api/${API_VERSION}/token` });

router.get("/login", async (req, res) => {
    req.body = "XDD";
});

export default router;
