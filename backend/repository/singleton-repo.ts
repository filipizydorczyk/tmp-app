import { getDatabase, SINGLETON_TABLE_NAME } from "@tmp/back/db";
import { RunResult } from "sqlite3";

const PASSWORD_KEY = "password";

const useSingletoRepository = () => {
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
        });
    };

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
        });
    };

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
        });
    };

    return { getPassword, setPassword, changePassword };
};

export default useSingletoRepository;
