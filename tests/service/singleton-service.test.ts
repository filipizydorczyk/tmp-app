import assert from "assert";
import bcrypt from "bcrypt";
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

    it("should create password if there is no password yet", async () => {
        const repository = useSingletoRepository();
        const repoSetPassSpy = sinon.spy(repository, "setPassword");
        const repoChangePassSpy = sinon.spy(repository, "changePassword");
        sinon.stub(repository, "getPassword").returns(
            new Promise((resolve, _) => {
                resolve(null);
            })
        );

        const { setPassword } = useSingletonService(repository);
        await setPassword(SUPER_SECRET_PASSWORD);

        assert.deepEqual(repoSetPassSpy.callCount, 1);
        assert.deepEqual(repoChangePassSpy.callCount, 0);
    });

    it("should update password", async () => {
        const repository = useSingletoRepository();
        const repoSetPassSpy = sinon.spy(repository, "setPassword");
        const repoChangePassSpy = sinon.spy(repository, "changePassword");
        sinon.stub(repository, "getPassword").returns(
            new Promise((resolve, _) => {
                resolve(SUPER_SECRET_PASSWORD);
            })
        );

        const { setPassword } = useSingletonService(repository);
        await setPassword(SUPER_SECRET_PASSWORD);

        assert.deepEqual(repoSetPassSpy.callCount, 0);
        assert.deepEqual(repoChangePassSpy.callCount, 1);
    });

    it("should compare password with its hash with success", async () => {
        const repository = useSingletoRepository();
        sinon.stub(repository, "getPassword").returns(
            new Promise(async (resolve, _) => {
                const response = await bcrypt.hash(SUPER_SECRET_PASSWORD, 10);
                resolve(response);
            })
        );
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords(SUPER_SECRET_PASSWORD);
        assert.ok(response);
    });

    it("should compare password with its hash with failure", async () => {
        const repository = useSingletoRepository();
        sinon.stub(repository, "getPassword").returns(
            new Promise(async (resolve, _) => {
                const response = await bcrypt.hash(SUPER_SECRET_PASSWORD, 10);
                resolve(response);
            })
        );
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords("not-correct-password");
        assert.ok(!response);
    });

    it("should compare with failure when there is no password", async () => {
        const repository = useSingletoRepository();
        sinon.stub(repository, "getPassword").returns(
            new Promise(async (resolve, _) => {
                resolve(null);
            })
        );
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords(SUPER_SECRET_PASSWORD);
        assert.ok(!response);
    });
});
