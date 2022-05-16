/**
 * For this test is important to set `ACCESS_TOKEN_SECRET` and
 * `REFRESH_TOKEN_SECRET` envs. Normally app can create own secrets
 * and work without it but for test its important that test file has
 * same tokens as security file
 *
 * @author Filip Izydorczyk
 */

import { SingletonRepository } from "@tmp/back/repositories/singleton-repo";
import useSecurity from "@tmp/back/security";
import useSingletonService from "@tmp/back/services/singleton-service";
import assert from "assert";
import jwt from "jsonwebtoken";
import sinon from "sinon";

const TEST_PASSWORD = "test";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const USER = "admin";

describe.only(`Security tests`, () => {
    it("should login with correct creadentials", async () => {
        const service = useSingletonService({} as SingletonRepository);
        sinon
            .stub(service, "getPassword")
            .returns(Promise.resolve(TEST_PASSWORD));
        sinon.stub(service, "setPassword").returns(Promise.resolve(false));
        sinon.stub(service, "comparePasswords").returns(Promise.resolve(true));

        const { login } = useSecurity(service);
        const response = await login(TEST_PASSWORD);
        assert.deepEqual(response.type, "login");
        assert.ok(response.tokens.accessToken !== null);
        assert.ok(response.tokens.refreshToken !== null);
    });

    it("should create passwrod if there is no password yet", async () => {
        const service = useSingletonService({} as SingletonRepository);
        sinon.stub(service, "getPassword").returns(Promise.resolve(null));
        sinon.stub(service, "setPassword").returns(Promise.resolve(true));
        sinon.stub(service, "comparePasswords").returns(Promise.resolve(false));

        const { login } = useSecurity(service);
        const response = await login(TEST_PASSWORD);
        assert.deepEqual(response.type, "create");
        assert.ok(response.tokens.accessToken !== null);
        assert.ok(response.tokens.refreshToken !== null);
    });

    it("should reject if password is incorect", async () => {
        const service = useSingletonService({} as SingletonRepository);
        sinon
            .stub(service, "getPassword")
            .returns(Promise.resolve(TEST_PASSWORD));
        sinon.stub(service, "setPassword").returns(Promise.resolve(false));
        sinon.stub(service, "comparePasswords").returns(Promise.resolve(false));

        const { login } = useSecurity(service);
        const response = await login("not-correct-password");
        assert.deepEqual(response.type, "refuse");
        assert.deepEqual(response.tokens.accessToken, null);
        assert.deepEqual(response.tokens.refreshToken, null);
    });

    it("should validate correct token", async () => {
        const service = useSingletonService({} as SingletonRepository);
        const acccessToken = jwt.sign(
            { user: USER },
            ACCESS_TOKEN_SECRET || "",
            {
                expiresIn: "15m",
            }
        );
        const { validate } = useSecurity(service);
        const response = await validate(acccessToken);
        assert.ok(response);
    });

    it("should invalidate incorrect token", async () => {
        const service = useSingletonService({} as SingletonRepository);
        const { validate } = useSecurity(service);
        const response = await validate("totally-wrong-token");
        assert.ok(response);
    });

    it("should logout", () => {
        assert.ok(false);
    });

    it("should not logout if refresh token doesnt exist", () => {
        assert.ok(false);
    });

    it("should refresh token", () => {
        assert.ok(false);
    });

    it("should fail refreshing with incorect token", () => {
        assert.ok(false);
    });
});
