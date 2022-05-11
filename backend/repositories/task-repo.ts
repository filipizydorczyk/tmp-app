import { getDatabase, TASK_TABLE_NAME } from "@tmp/back/db";
import { Page } from "@tmp/back/util";
import { randomUUID } from "crypto";
import { RunResult } from "sqlite3";

export type TaskEntity = {
    Id: string;
    Title: string;
    Date: string;
    Done: 0 | 1;
};

export type TaskRepository = {
    getAllTasks: (page: number, size: number) => Promise<Page<TaskEntity>>;
    createTask: (values: TaskEntity) => Promise<TaskEntity>;
    updateTask: (values: TaskEntity) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
};

/**
 * Funtion to get database calls realted to Tasks table in db
 * @returns collection of functions
 */
const useTaskRepository = (): TaskRepository => {
    /**
     * Function to get all tasks from db
     *
     * @param page which page should be fetch. First page should be 0
     * @param size ammount of element at single page
     * @returns list of task entitites. Entity keys are matching
     * database columns names and because of that type keys are
     * uppercased
     */
    const getAllTasks = (
        page: number,
        size: number
    ): Promise<Page<TaskEntity>> => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();

            db.all(
                `SELECT * FROM ${TASK_TABLE_NAME} LIMIT ${size} OFFSET ${
                    page * size
                }`,
                (err, resp) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            page,
                            size,
                            pages: 0,
                            total: 0,
                            content: resp as TaskEntity[],
                        });
                    }
                }
            );

            db.close();
        });
    };

    /**
     * Function to create new task in database. If this function fails
     * make sure that you use node that supports `randomUUID` function
     * from `crypto` package.
     *
     * @param values entity be inserted database. Since this function
     * will create new entry `Id` field will be ignored even if it
     * was provided
     *
     * @returns entity of newly created task
     */
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

    /**
     * Functtion to update existing task in database.
     *
     * @param values entity with values to be inserted. If you want to
     * keep old values in some fileds you need to put them in provided
     * entity
     *
     * @returns boolean if operation was successful
     */
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

    /**
     * Function to delete task from database. This task will be removed
     * pernamently from database
     *
     * @param id of task to be deleted
     * @returns boolean if operation was successful
     */
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
