import useApp from "@tmp/back/app";
import dependencies from "@tmp/back/dependencies";
import useTaskSchedule from "@tmp/back/tasks";

export const APP_PORT = process.env.PORT || 8080;

export const app = useApp(dependencies);
useTaskSchedule(dependencies);

app.listen(APP_PORT);
