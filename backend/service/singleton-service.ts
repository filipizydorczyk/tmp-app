import useSingletoRepository from "@tmp/back/repository/singleton-repo";
import bcrypt from "bcrypt";

/**
 * Service for key value data
 * @returns functions to interact key value data
 */
const useSingletonService = () => {
    const {
        getPassword: getPasswordFromDb,
        setPassword: setPasswordAtDb,
        changePassword: changePasswordAtDb,
    } = useSingletoRepository();

    /**
     * Function to obtain app password
     * @returns password of the app if exists and null otherwise
     */
    const getPassword = async (): Promise<string | null> => {
        return getPasswordFromDb();
    };

    /**
     * Function to set app password of the app
     * @param password password to be encrypted and saved in db
     * @returns true if operation was successfull and false otherwise
     */
    const setPassword = async (password: string): Promise<boolean> => {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const currentPassword = await getPasswordFromDb();

        if (currentPassword === null) {
            return setPasswordAtDb(encryptedPassword);
        } else {
            return changePasswordAtDb(encryptedPassword);
        }
    };

    /**
     * Function to compare provided passwrods with password set in db.
     * If there is no password in db false will be returned
     * @param password password to be validated
     * @returns if provided password is correct one
     */
    const comparePasswords = async (password: string): Promise<boolean> => {
        const currentPassword = await getPasswordFromDb();
        if (currentPassword === null) {
            return false;
        }
        const result = await bcrypt.compare(password, currentPassword);

        return result;
    };

    return { getPassword, setPassword, comparePasswords };
};

export default useSingletonService;
