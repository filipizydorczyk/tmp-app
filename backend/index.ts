import Koa from "koa";
import { tokenRoutes } from "@tmp/back/routes";

export const APP_PORT = 8080;

const app = new Koa();

app.use(tokenRoutes.routes());
app.listen(APP_PORT);
