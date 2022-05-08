import assert from "assert";
import bcrypt from "bcrypt";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";

const SUPER_SECRET_PASSWORD = "totaly-secret-and-encrypted-password";
const SAMPLE_NOTE = "I am sample note!";

describe("SingletonService", () => {
    it("should return current password", async () => {
        const repository = useSingletonRepository();
        sinon
            .stub(repository, "getPassword")
            .returns(Promise.resolve(SUPER_SECRET_PASSWORD));
        const { getPassword } = useSingletonService(repository);
        const pas = await getPassword();
        assert.deepEqual(pas, SUPER_SECRET_PASSWORD);
    });

    it("should create password if there is no password yet", async () => {
        const repository = useSingletonRepository();
        const repoSetPassSpy = sinon.spy(repository, "setPassword");
        const repoChangePassSpy = sinon.spy(repository, "changePassword");
        sinon.stub(repository, "getPassword").returns(Promise.resolve(null));

        const { setPassword } = useSingletonService(repository);
        await setPassword(SUPER_SECRET_PASSWORD);

        assert.deepEqual(repoSetPassSpy.callCount, 1);
        assert.deepEqual(repoChangePassSpy.callCount, 0);
    });

    it("should update password", async () => {
        const repository = useSingletonRepository();
        const repoSetPassSpy = sinon.spy(repository, "setPassword");
        const repoChangePassSpy = sinon.spy(repository, "changePassword");
        sinon
            .stub(repository, "getPassword")
            .returns(Promise.resolve(SUPER_SECRET_PASSWORD));

        const { setPassword } = useSingletonService(repository);
        await setPassword(SUPER_SECRET_PASSWORD);

        assert.deepEqual(repoSetPassSpy.callCount, 0);
        assert.deepEqual(repoChangePassSpy.callCount, 1);
    });

    it("should compare password with its hash with success", async () => {
        const repository = useSingletonRepository();
        sinon
            .stub(repository, "getPassword")
            .returns(Promise.resolve(bcrypt.hash(SUPER_SECRET_PASSWORD, 10)));
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords(SUPER_SECRET_PASSWORD);
        assert.ok(response);
    });

    it("should compare password with its hash with failure", async () => {
        const repository = useSingletonRepository();
        sinon
            .stub(repository, "getPassword")
            .returns(Promise.resolve(bcrypt.hash(SUPER_SECRET_PASSWORD, 10)));
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords("not-correct-password");
        assert.ok(!response);
    });

    it("should compare with failure when there is no password", async () => {
        const repository = useSingletonRepository();
        sinon.stub(repository, "getPassword").returns(Promise.resolve(null));
        const { comparePasswords } = useSingletonService(repository);
        const response = await comparePasswords(SUPER_SECRET_PASSWORD);
        assert.ok(!response);
    });

    it("should get notes from singleton table", async () => {
        const repository = useSingletonRepository();
        sinon
            .stub(repository, "getNotes")
            .returns(Promise.resolve(SAMPLE_NOTE));
        const { getNotes } = useSingletonService(repository);
        const response = await getNotes();
        assert.ok(typeof response === "string");
    });

    it("should get null from singleton table if there is no notes", async () => {
        const repository = useSingletonRepository();
        sinon.stub(repository, "getNotes").returns(Promise.resolve(null));

        const { getNotes } = useSingletonService(repository);
        const response = await getNotes();
        assert.ok(response === null);
    });

    it("should save create record for notes if there is no notes yet", async () => {
        const repository = useSingletonRepository();
        sinon.stub(repository, "getNotes").returns(Promise.resolve(null));
        const setNotesSpy = sinon.spy(repository, "setNotes");
        const updateNotesSpy = sinon.spy(repository, "updateNotes");

        const { saveNotes } = useSingletonService(repository);
        await saveNotes(SAMPLE_NOTE);
        assert.deepEqual(setNotesSpy.callCount, 1);
        assert.deepEqual(updateNotesSpy.callCount, 0);
    });

    it("should save update record for notes if there is no notes yet", async () => {
        const repository = useSingletonRepository();
        sinon
            .stub(repository, "getNotes")
            .returns(Promise.resolve(SAMPLE_NOTE));
        const setNotesSpy = sinon.spy(repository, "setNotes");
        const updateNotesSpy = sinon.spy(repository, "updateNotes");

        const { saveNotes } = useSingletonService(repository);
        await saveNotes(SAMPLE_NOTE);
        assert.deepEqual(setNotesSpy.callCount, 0);
        assert.deepEqual(updateNotesSpy.callCount, 1);
    });
});
