import useApp from "@tmp/back/app";
import dependencies from "@tmp/back/dependencies";
import useTaskSchedule from "./tasks";

export const APP_PORT = 8080;

export const app = useApp(dependencies);

useTaskSchedule();
app.listen(APP_PORT);
