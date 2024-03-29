import { getDatabase, TASK_TABLE_NAME } from "@tmp/back/db/";
import { Page } from "@tmp/back/utils";
import { RunResult } from "sqlite3";

export type TaskEntity = {
    Id: string;
    Title: string;
    Date: string;
    Done: 0 | 1;
    Color: string;
    Today: 0 | 1;
};

export type TaskRepository = {
    getTotalTaskCount: () => Promise<number>;
    getDoneForToday: () => Promise<TaskEntity[]>;
    getAllTasks: (page: number, size: number) => Promise<Page<TaskEntity>>;
    createTask: (values: TaskEntity) => Promise<TaskEntity>;
    updateTask: (values: TaskEntity) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
};

/**
 * Funtion to get database calls realted to Tasks table in db
 * @returns collection of functions
 */
const useTaskRepository = (dbPath?: string): TaskRepository => {
    /**
     * Function tp get number of how many tasks are being
     * stored in db
     *
     * @returns number of stored task
     */
    const getTotalTaskCount = async (): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            const db = await getDatabase({ path: dbPath });

            db.get(`SELECT COUNT(*) FROM ${TASK_TABLE_NAME}`, (err, resp) => {
                if (err) {
                    resolve(0);
                } else {
                    resolve(resp["COUNT(*)"] as number);
                }
            });

            db.close();
        });
    };

    /**
     * Function to get all tasks from db, Entity
     * keys are matching database columns names
     * and because of that type keys are uppercased
     *
     * @param page which page should be fetch. First page should be 0
     * @param size ammount of element at single page
     * @returns page of soreted list of task entitites.
     * Returned list is soreted first if either task is done
     * or not. Than it sorts it by color so that tasks whit the same
     * colors stays in groups.
     *
     */
    const getAllTasks = async (
        page: number,
        size: number
    ): Promise<Page<TaskEntity>> => {
        return new Promise(async (resolve, reject) => {
            const db = await getDatabase({ path: dbPath });
            const totalElements = await getTotalTaskCount();

            db.all(
                `SELECT * FROM ${TASK_TABLE_NAME} ORDER BY Done, Today, length(Color), Color DESC NULLS FIRST LIMIT ${size} OFFSET ${
                    page * size
                }`,
                (err, resp) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            page,
                            size,
                            pages: Math.ceil(totalElements / size),
                            total: totalElements,
                            content: resp as TaskEntity[],
                        });
                    }
                }
            );

            db.close();
        });
    };

    /**
     * Funtion that gets all tasks that were mark as done for today
     * @returns list of TaskEntity
     */
    const getDoneForToday = async (): Promise<TaskEntity[]> => {
        return new Promise(async (resolve, reject) => {
            const db = await getDatabase({ path: dbPath });

            db.all(
                `SELECT * FROM ${TASK_TABLE_NAME} WHERE Today = 1`,
                (err, resp) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resp as TaskEntity[]);
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
    const createTask = async ({
        Id,
        Title,
        Date,
        Done,
        Color,
        Today,
    }: TaskEntity): Promise<TaskEntity> => {
        return new Promise(async (resolve, rejects) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `INSERT INTO ${TASK_TABLE_NAME} VALUES ('${Id}', '${Title}', '${Date}', ${Done}, '${Color}', ${Today})`,
                (_: RunResult, err: Error | null) => {
                    if (err) {
                        rejects(err);
                    } else {
                        resolve({ Id, Title, Date, Done, Color, Today });
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
    const updateTask = async ({
        Id,
        Title,
        Date,
        Done,
        Color,
        Today,
    }: TaskEntity): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `UPDATE ${TASK_TABLE_NAME} SET Title = '${Title}', Date = '${Date}', Done = ${Done}, Color = '${Color}', Today = ${Today} WHERE Id = '${Id}'`,
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
    const deleteTask = async (id: string): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

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
        getTotalTaskCount,
        getDoneForToday,
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};

export default useTaskRepository;
