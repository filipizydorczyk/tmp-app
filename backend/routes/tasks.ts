import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { API_VERSION } from "@tmp/back/routes";
import { AppDependencies } from "@tmp/back/app";
import { TaskDTO, NewTaskDTO } from "@tmp/back/dto";

const router = new Router({ prefix: `${API_VERSION}/tasks` });

router.get("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { getTasks } = (ctx.dependencies as AppDependencies).taskService;
    const response = await getTasks();

    ctx.status = 200;
    ctx.body = response;
});

router.post("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { createTask } = (ctx.dependencies as AppDependencies).taskService;
    const body = ctx.request.body as NewTaskDTO;

    // TODO move creating logic to service (also id creating from repo to service)
    const response = await createTask({
        id: "",
        title: body.title,
        date: new Date().toISOString(),
        done: false,
    });

    ctx.status = 200;
    ctx.body = response;
});

router.put("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { updateTask } = (ctx.dependencies as AppDependencies).taskService;
    const newValues = ctx.request.body as TaskDTO;

    const result = await updateTask(newValues);

    ctx.status = result ? 200 : 500;
    ctx.body = newValues;
});

router.delete("/:id", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { deleteTask } = (ctx.dependencies as AppDependencies).taskService;
    const id = ctx.params.id;

    const result = await deleteTask(id);

    ctx.status = result ? 200 : 500;
    ctx.body = {};
});

export default router;
