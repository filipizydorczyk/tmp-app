import { getDatabase, TASK_TABLE_NAME } from "@tmp/back/db";
import { randomUUID } from "crypto";
import { RunResult } from "sqlite3";

export type TaskEntity = {
    Id: string;
    Title: string;
    Date: string;
    Done: 0 | 1;
};

export type TaskRepository = {
    getAllTasks: () => Promise<TaskEntity[]>;
    createTask: (values: TaskEntity) => Promise<TaskEntity>;
    updateTask: (values: TaskEntity) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
};

const useTaskRepository = (): TaskRepository => {
    const getAllTasks = (): Promise<TaskEntity[]> => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();

            db.all(`SELECT * FROM ${TASK_TABLE_NAME}`, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp as TaskEntity[]);
                }
            });

            db.close();
        });
    };
    const createTask = ({
        Title,
        Date,
        Done,
    }: TaskEntity): Promise<TaskEntity> => {
        return new Promise((resolve, rejects) => {
            const db = getDatabase();
            const id = randomUUID();

            db.run(
                `INSERT INTO ${TASK_TABLE_NAME} VALUES ('${id}', '${Title}', '${Date}', ${Done})`,
                (_: RunResult, err: Error | null) => {
                    if (err) {
                        rejects(err);
                    } else {
                        resolve({ Id: id, Title, Date, Done });
                    }
                }
            );

            db.close();
        });
    };
    const updateTask = ({
        Id,
        Title,
        Date,
        Done,
    }: TaskEntity): Promise<boolean> => {
        return new Promise((resolve, _) => {
            const db = getDatabase();

            db.run(
                `UPDATE ${TASK_TABLE_NAME} SET Title = '${Title}', Date = '${Date}', Done = ${Done} WHERE Id = '${Id}'`,
                (_: RunResult, err: Error | null) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );

            db.close();
        });
    };
    const deleteTask = (id: string): Promise<boolean> => {
        return new Promise((resolve, _) => {
            const db = getDatabase();

            db.run(
                `DELETE FROM ${TASK_TABLE_NAME} WHERE Id = '${id}'`,
                (_: RunResult, err: Error | null) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );

            db.close();
        });
    };

    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};

export default useTaskRepository;
