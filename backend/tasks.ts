import schedule from "node-schedule";
import { AppDependencies } from "@tmp/back/app";

/**
 * Funciton to setup cron jobs to be called regularly
 * @param dependencies app dependencies
 */
const useTaskSchedule = (dependencies: AppDependencies) => {
    schedule.scheduleJob("0 0 0 * * *", () => {
        const { clearRefreshTokens } = dependencies.security;
        clearRefreshTokens();
    });

    schedule.scheduleJob("0 26 23 * * *", () => {
        const { renewDoneForToday } = dependencies.taskService;
        renewDoneForToday();
    });
};

export default useTaskSchedule;
