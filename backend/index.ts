import useSingletoRepository from "@tmp/back/repository/singleton-repo";

const { getPassword, setPassword, changePassword } = useSingletoRepository();

(async () => {
    const result = await changePassword("testxd");
    console.log(result);
    const paswd = await getPassword();
    console.log(paswd);
})();
