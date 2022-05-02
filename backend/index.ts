import useApp from "@tmp/back/app";
import dependencies from "@tmp/back/dependencies";

export const APP_PORT = 8080;

export const app = useApp(dependencies);

app.listen(APP_PORT);
