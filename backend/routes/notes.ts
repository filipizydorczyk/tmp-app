import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

import { API_VERSION } from "@tmp/back/routes";
import { AppDependencies } from "@tmp/back/app";

const router = new Router({ prefix: `${API_VERSION}/notes` });

export type NotesDTO = {
    content: string | null;
    message: string;
};

router.get("/", bodyParser(), async (ctx) => {
    // TODO add token validation for now there is none
    const { getNotes } = (ctx.dependencies as AppDependencies).singletonService;
    const notes = await getNotes();

    ctx.status = 200;
    ctx.body = {
        content: notes || "",
        message: "Notes sucessfully fetched",
    } as NotesDTO;
});

router.post("/", bodyParser(), async (ctx) => {
    if (!ctx.request.body.content) {
        ctx.status = 400;
        ctx.body = {
            content: null,
            message: "No body was provided",
        } as NotesDTO;
        return;
    }
    // TODO add token validation for now there is none
    const { getNotes, saveNotes } = (ctx.dependencies as AppDependencies)
        .singletonService;
    const result = await saveNotes(ctx.request.body.content);

    const notes = await getNotes();

    ctx.status = result ? 200 : 500;
    ctx.body = {
        content: result ? notes || "" : null,
        message: result
            ? "Notes sucessfully updated"
            : "We werent able to save this note",
    } as NotesDTO;
});

export default router;
