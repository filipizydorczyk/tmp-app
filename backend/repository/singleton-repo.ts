import { getDatabase, SINGLETON_TABLE_NAME } from "@tmp/back/db";
import { RunResult } from "sqlite3";

const PASSWORD_KEY = "password";

/**
 * Repository to make db calls for key value data
 * @returns functions make db transactions on "Singletons" table
 */
const useSingletoRepository = () => {
    /**
     * Function to get password from db
     * @returns password from db if exists false otherwise
     */
    const getPassword = (): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const db = getDatabase();

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
        return new Promise((resolve, reject) => {
            const db = getDatabase();

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
        return new Promise((resolve, reject) => {
            const db = getDatabase();

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

    return { getPassword, setPassword, changePassword };
};

export default useSingletoRepository;
