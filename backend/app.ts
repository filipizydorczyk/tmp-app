import Koa from "koa";
import cors from "@koa/cors";
import { tokenRoutes } from "@tmp/back/routes";
import { SingletonService } from "@tmp/back/services/singleton-service";

export type AppDependencies = {
    singletonService: SingletonService;
};

/**
 * Creates and returns ready to run Koa app for backend application
 * @param dependencyMiddleware middleware to create dependencies used in routes.
 * In this function you need to assign value `ctx.dependencies` of
 * {@link AppDependencies} type
 * @returns Koa app ready to being started
 */
const useApp = (dependencies: AppDependencies) => {
    const app = new Koa();

    app.use(cors());
    app.use(async (ctx, next) => {
        ctx.dependencies = dependencies;
        await next();
    });
    app.use(tokenRoutes.routes());

    return app;
};

export default useApp;
