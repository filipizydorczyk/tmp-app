import useSingletonService from "@tmp/back/service/singleton-service";

(async () => {
    const { getPassword, setPassword } = useSingletonService();

    const passwrod1 = await getPassword();
    console.log(passwrod1);
    await setPassword("firsttests");

    const passwrod2 = await getPassword();
    console.log(passwrod2);
    await setPassword("gfsadjnfa");

    const passwrod3 = await getPassword();
    console.log(passwrod3);
})();
