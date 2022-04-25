import Koa from "koa";
import cors from "@koa/cors";
import { tokenRoutes } from "@tmp/back/routes";

export const APP_PORT = 8080;

const app = new Koa();

app.use(cors());
app.use(tokenRoutes.routes());
app.listen(APP_PORT);
