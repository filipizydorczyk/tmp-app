import useSingletoRepository from "@tmp/back/repository/singleton-repo";

const { getPassword, setPassword } = useSingletoRepository();

(async () => {
    await setPassword("test");
    const paswd = await getPassword();
    console.log(paswd);
})();
