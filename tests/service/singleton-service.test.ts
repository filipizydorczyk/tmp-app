import assert from "assert";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletoRepository from "@tmp/back/repositories/singleton-repo";

const SUPER_SECRET_PASSWORD = "totaly-secret-and-encrypted-password";

describe("SingletonService", () => {
    it("should return current password", async () => {
        const repository = useSingletoRepository();
        sinon.stub(repository, "getPassword").returns(
            new Promise((resolve, _) => {
                resolve(SUPER_SECRET_PASSWORD);
            })
        );
        const { getPassword } = useSingletonService(repository);
        const pas = await getPassword();
        assert.deepEqual(pas, SUPER_SECRET_PASSWORD);
    });
});
