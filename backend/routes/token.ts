import Router from "@koa/router";
import { API_VERSION } from "@tmp/back/routes";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";

const router = new Router({ prefix: `${API_VERSION}/token` });

router.get("/login", async (req, res) => {
    const repository = useSingletonRepository();
    const { getPassword, setPassword, comparePasswords } =
        useSingletonService(repository);
    const currentPassword = await getPassword();
    const providedPassword = req.body.password;

    if (currentPassword === null) {
        const isPasswordSet = await setPassword(providedPassword);
        req.status = isPasswordSet ? 200 : 401;
    } else {
        const result = await comparePasswords(providedPassword);
        req.status = result ? 200 : 401;
    }

    req.body = "XDD";
});

export default router;
