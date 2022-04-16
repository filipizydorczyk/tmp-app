import useSingletoRepository from "@tmp/back/repository/singleton-repo";
import bcrypt from "bcrypt";

const useSingletonService = () => {
    const {
        getPassword: getPasswordFromDb,
        setPassword: setPasswordAtDb,
        changePassword: changePasswordAtDb,
    } = useSingletoRepository();

    const getPassword = async (): Promise<string | null> => {
        return getPasswordFromDb();
    };

    const setPassword = async (password: string) => {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const currentPassword = await getPasswordFromDb();

        if (currentPassword === null) {
            return setPasswordAtDb(encryptedPassword);
        } else {
            return changePasswordAtDb(encryptedPassword);
        }
    };

    return { getPassword, setPassword };
};

export default useSingletonService;
