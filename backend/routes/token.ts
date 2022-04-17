import Router from "@koa/router";
import { API_VERSION } from "@tmp/back/routes";
import useSingletonService from "@tmp/back/service/singleton-service";
import useSingletonRepository from "@tmp/back/repository/singleton-repo";

const router = new Router({ prefix: `${API_VERSION}/token` });

router.get("/login", async (req, res) => {
    const repository = useSingletonRepository();
    const { getPassword } = useSingletonService(repository);
    const currentPassword = await getPassword();

    if (currentPassword === null) req.status = 400;

    req.body = "XDD";
});

export default router;
