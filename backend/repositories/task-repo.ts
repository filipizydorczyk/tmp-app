import { getDatabase, TASK_TABLE_NAME } from "@tmp/back/db";

export type TaskEntity = {
    id: string;
    title: string;
    date: string;
    done: 0 | 1;
};

const useTaskRepository = () => {
    const getAllTasks = (): Promise<TaskEntity[]> => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();

            db.get(`SELECT * FROM ${TASK_TABLE_NAME}"`, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row as TaskEntity[]);
                }
            });

            db.close();
        });
    };
    const createTask = ({ title, date, done }: TaskEntity) => {};
    const updateTask = ({ id, title, date, done }: TaskEntity) => {};
    const deleteTask = (id: string) => {};

    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
