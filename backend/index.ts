import useApp from "@tmp/back/app";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import useSingletonService from "@tmp/back/services/singleton-service";

export const APP_PORT = 8080;

export const app = useApp(async (ctx, next) => {
    const repository = useSingletonRepository();
    ctx.dependencies = {
        singletonService: useSingletonService(repository),
    };
    await next();
});

app.listen(APP_PORT);
