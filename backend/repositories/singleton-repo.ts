import { getDatabase, NOTES_KEY, PASSWORD_KEY, SINGLETON_TABLE_NAME } from "@tmp/back/db/";
import { RunResult } from "sqlite3";



export type SingletonRepository = {
    getPassword: () => Promise<string | null>;
    setPassword: (password: string) => Promise<boolean>;
    changePassword: (password: string) => Promise<boolean>;
    getNotes: () => Promise<string | null>;
    setNotes: (notes: string) => Promise<boolean>;
    updateNotes: (notes: string) => Promise<boolean>;
};

/**
 * Repository to make db calls for key value data
 * @returns functions make db transactions on "Singletons" table
 */
const useSingletonRepository = (dbPath?: string): SingletonRepository => {
    /**
     * Function to get password from db
     * @returns password from db if exists false otherwise
     */
    const getPassword = (): Promise<string | null> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.get(
                `SELECT * FROM ${SINGLETON_TABLE_NAME} WHERE Key="${PASSWORD_KEY}"`,
                (err, row) => {
                    if (row === undefined || err) {
                        resolve(null);
                    } else {
                        resolve(row["Value"] as string);
                    }
                }
            );

            db.close();
        });
    };

    /**
     * Function to create app password. Use it only if u know there is no password yet
     * @param password already encrypted password to be created
     * @returns boolean if transaction was successfull
     */
    const setPassword = (password: string): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `INSERT INTO ${SINGLETON_TABLE_NAME} VALUES ('${PASSWORD_KEY}', '${password}')`,
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
     * Function to update app password. Use it if password was already created
     * @param password already encrypted password to be set
     * @returns boolean if transaction was successfull
     */
    const changePassword = (password: string): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `UPDATE ${SINGLETON_TABLE_NAME} SET Value = '${password}' WHERE Key = '${PASSWORD_KEY}'`,
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
     * Function to fetch saved notes form database. Notes have no history tracking
     * so if you save them u will lose previous ones
     * @returns string note fetched from db or null if there is no one yet
     */
    const getNotes = (): Promise<string | null> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.get(
                `SELECT * FROM ${SINGLETON_TABLE_NAME} WHERE Key="${NOTES_KEY}"`,
                (err, row) => {
                    if (row === undefined || err) {
                        resolve(null);
                    } else {
                        resolve(row["Value"] as string);
                    }
                }
            );

            db.close();
        });
    };

    /**
     * Function to save notes in database. Use it only if there is no notes in db yet.
     * @param notes string to be saved in database as a note
     * @returns boolean if operation was successfull or not
     */
    const setNotes = (notes: string): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `INSERT INTO ${SINGLETON_TABLE_NAME} VALUES ('${NOTES_KEY}', '${notes}')`,
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
     * Funciton to updates notes in db. Use it if there is already saved note in db
     * @param notes string to be saved in database as a note
     * @returns boolean if operation was successfull or not
     */
    const updateNotes = (notes: string): Promise<boolean> => {
        return new Promise(async (resolve, _) => {
            const db = await getDatabase({ path: dbPath });

            db.run(
                `UPDATE ${SINGLETON_TABLE_NAME} SET Value = '${notes}' WHERE Key = '${NOTES_KEY}'`,
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
        getPassword,
        setPassword,
        changePassword,
        getNotes,
        setNotes,
        updateNotes,
    };
};

export default useSingletonRepository;
