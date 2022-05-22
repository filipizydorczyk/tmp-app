import schedule from "node-schedule";

const useTaskSchedule = () => {
    schedule.scheduleJob("* * * * * *", () => {
        console.log(Date.now(), "test cron");
    });
};

export default useTaskSchedule;
