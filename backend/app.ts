import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import cors from "@koa/cors";
import { tokenRoutes } from "@tmp/back/routes";
import { SingletonService } from "@tmp/back/services/singleton-service";

export type AppDependencies = {
    singletonService: SingletonService;
};

const useApp = (
    dependencyMiddleware: Middleware<DefaultState, DefaultContext, any>
) => {
    const app = new Koa();

    app.use(cors());
    app.use(dependencyMiddleware);
    app.use(tokenRoutes.routes());

    return app;
};

export default useApp;
