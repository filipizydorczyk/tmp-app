import Koa from "koa";
import cors from "@koa/cors";
import { tokenRoutes, notesRoutes } from "@tmp/back/routes";
import { SingletonService } from "@tmp/back/services/singleton-service";
import { TaskService } from "@tmp/back/services/task-service";

export type AppDependencies = {
    singletonService: SingletonService;
    taskService: TaskService;
};

/**
 * Creates and returns ready to run Koa app for backend application
 * @param dependencies dependencies to be passed in middleware
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
    app.use(notesRoutes.routes());

    return app;
};

export default useApp;
