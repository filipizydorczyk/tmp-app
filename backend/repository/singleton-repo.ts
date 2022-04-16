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
                (resp: RunResult, err: Error | null) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    };

    return { getPassword, setPassword };
};

export default useSingletoRepository;
