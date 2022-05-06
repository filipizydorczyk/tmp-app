import { SingletonRepository } from "@tmp/back/repositories/singleton-repo";
import bcrypt from "bcrypt";

export type SingletonService = {
    getPassword: () => Promise<string | null>;
    setPassword: (password: string) => Promise<boolean>;
    comparePasswords: (password: string) => Promise<boolean>;
    getNotes: () => Promise<string | null>;
    saveNotes: (notes: string) => Promise<boolean>;
};

/**
 * Service for key value data
 * @param repository responisble for connection with db
 * @returns functions to interact key value data
 */
const useSingletonService = (repository: SingletonRepository) => {
    const {
        getPassword: getPasswordFromDb,
        setPassword: setPasswordAtDb,
        changePassword: changePasswordAtDb,
        getNotes: getNotesFromDb,
        setNotes,
        updateNotes,
    } = repository;

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

    /**
     * Function to obtain app notes. There is single note for whole app
     * since there is no users in this app
     * @returns string if notes exists and null otherwise
     */
    const getNotes = async (): Promise<string | null> => {
        return getNotesFromDb();
    };

    /**
     * Function to save note in database. If there is no note yet it will
     * create new record in Singleton table otherwise it will update existing record
     * @param notes string to be saved
     * @returns if operation was successfull
     */
    const saveNotes = async (notes: string): Promise<boolean> => {
        const currentNote = await getNotesFromDb();

        if (currentNote == null) {
            return setNotes(notes);
        } else {
            return updateNotes(notes);
        }
    };

    return {
        getPassword,
        setPassword,
        comparePasswords,
        getNotes,
        saveNotes,
    } as SingletonService;
};

export default useSingletonService;
