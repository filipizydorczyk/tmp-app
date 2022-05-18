import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { API_VERSION } from "@tmp/back/routes";
import { AppDependencies } from "@tmp/back/app";
import {
    TaskDTO,
    NewTaskDTO,
    isNewTaskDTOValid,
    isTaskDTOValid,
} from "@tmp/back/dto";
import { validateToken } from "@tmp/back/security";

const router = new Router({ prefix: `${API_VERSION}/tasks` });
router.use(validateToken);

router.get("/", bodyParser(), async (ctx) => {
    const { getTasks } = (ctx.dependencies as AppDependencies).taskService;
    const response = await getTasks();

    ctx.status = 200;
    ctx.body = response;
});

router.post("/", bodyParser(), async (ctx) => {
    const { createTask } = (ctx.dependencies as AppDependencies).taskService;
    const body = ctx.request.body as NewTaskDTO;
    if (!isNewTaskDTOValid(body)) {
        ctx.status = 400;
        return;
    }

    const response = await createTask(body);

    ctx.status = 200;
    ctx.body = response;
});

router.put("/", bodyParser(), async (ctx) => {
    const { updateTask } = (ctx.dependencies as AppDependencies).taskService;
    const newValues = ctx.request.body as TaskDTO;
    if (!isTaskDTOValid(newValues)) {
        ctx.status = 400;
        return;
    }

    const result = await updateTask(newValues);

    ctx.status = result ? 200 : 500;
    ctx.body = newValues;
});

router.delete("/:id", bodyParser(), async (ctx) => {
    const { deleteTask } = (ctx.dependencies as AppDependencies).taskService;
    const id = ctx.params.id;

    const result = await deleteTask(id);

    ctx.status = result ? 200 : 500;
    ctx.body = {};
});

export default router;
