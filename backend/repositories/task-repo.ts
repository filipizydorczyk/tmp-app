import { getDatabase, TASK_TABLE_NAME } from "@tmp/back/db";
import { randomUUID } from "crypto";
import { RunResult } from "sqlite3";

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
    const createTask = ({
        title,
        date,
        done,
    }: TaskEntity): Promise<TaskEntity> => {
        return new Promise((resolve, rejects) => {
            const db = getDatabase();
            const id = randomUUID();

            db.run(
                `INSERT INTO ${TASK_TABLE_NAME} VALUES ('${id}', '${title}', '${date}', ${done})`,
                (_: RunResult, err: Error | null) => {
                    if (err) {
                        rejects(err);
                    } else {
                        resolve({ id, title, date, done });
                    }
                }
            );

            db.close();
        });
    };
    const updateTask = ({ id, title, date, done }: TaskEntity) => {
        return new Promise((resolve, _) => {
            const db = getDatabase();

            db.run(
                `UPDATE ${TASK_TABLE_NAME} SET Title = '${title}', Date = '${date}', Done = ${done} WHERE Id = '${id}'`,
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
    const deleteTask = (id: string) => {};

    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
