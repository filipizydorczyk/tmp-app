/**
 * For this test is important to set `ACCESS_TOKEN_SECRET` and
 * `REFRESH_TOKEN_SECRET` envs. Normally app can create own secrets
 * and work without it but for test its important that test file has
 * same tokens as security file
 *
 * @author Filip Izydorczyk
 */
import Koa from "koa";
import Router from "@koa/router";
import { SingletonRepository } from "@tmp/back/repositories/singleton-repo";
import useSecurity, { validateToken } from "@tmp/back/security";
import useSingletonService, {
    SingletonService,
} from "@tmp/back/services/singleton-service";
import assert from "assert";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import request from "supertest";

const TEST_PASSWORD = "test";
const TEST_ACCESS_TOKEN = "totally-not-fake-token";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const USER = "admin";

describe(`Security tests`, () => {
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
        assert.ok(!response);
    });

    it("should logout", () => {
        const service = useSingletonService({} as SingletonRepository);
        const { logout } = useSecurity(service, [REFRESH_TOKEN_SECRET || ""]);
        const result = logout(REFRESH_TOKEN_SECRET || "");

        assert.ok(result);
    });

    it("should not logout if refresh token doesnt exist", () => {
        const service = useSingletonService({} as SingletonRepository);
        const { logout } = useSecurity(service, [REFRESH_TOKEN_SECRET || ""]);
        const result = logout("wrong-token");

        assert.ok(!result);
    });

    it("should refresh token", async () => {
        const service = useSingletonService({} as SingletonRepository);
        const refreshToken = jwt.sign(
            { user: USER },
            REFRESH_TOKEN_SECRET || "",
            {
                expiresIn: "20m",
            }
        );
        const { refresh } = useSecurity(service, [refreshToken]);
        const result = await refresh(refreshToken);

        assert.deepEqual(result.type, "refresh");
        assert.ok(result.tokens.accessToken !== null);
        assert.ok(result.tokens.refreshToken !== null);
    });

    it("should fail refreshing with incorect token", async () => {
        const service = useSingletonService({} as SingletonRepository);
        const { refresh } = useSecurity(service, [REFRESH_TOKEN_SECRET || ""]);
        const result = await refresh("wrong-token");

        assert.deepEqual(result.type, "refuse");
        assert.deepEqual(result.tokens.accessToken, null);
        assert.deepEqual(result.tokens.refreshToken, null);
    });

    it("should fail refreshing when refresh token is not in list", async () => {
        const service = useSingletonService({} as SingletonRepository);
        const refreshToken = jwt.sign(
            { user: USER },
            REFRESH_TOKEN_SECRET || "",
            {
                expiresIn: "20m",
            }
        );
        const { refresh } = useSecurity(service, [REFRESH_TOKEN_SECRET || ""]);
        const result = await refresh(refreshToken);

        assert.deepEqual(result.type, "refuse");
        assert.deepEqual(result.tokens.accessToken, null);
        assert.deepEqual(result.tokens.refreshToken, null);
    });

    it("Koa middleware - should fail bacause of missing authorization header", (done) => {
        const app = new Koa();
        const router = new Router();
        router.get("/", (ctx, _) => {
            ctx.status = 200;
        });
        app.use(async (ctx, next) => {
            ctx.dependencies = { security: {} };
            await next();
        });
        app.use(validateToken);
        app.use(router.routes());

        request(app.callback()).get("/").expect(400).end(done);
    });

    it("Koa middleware - should fail bacause of wrong authorization header", (done) => {
        const app = new Koa();
        const router = new Router();
        const security = useSecurity({} as SingletonService);
        sinon.stub(security, "validate").returns(Promise.resolve(false));

        router.get("/", (ctx, _) => {
            ctx.status = 200;
        });
        app.use(async (ctx, next) => {
            ctx.dependencies = { security };
            await next();
        });
        app.use(validateToken);
        app.use(router.routes());

        request(app.callback())
            .get("/")
            .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
            .expect(403)
            .end(done);
    });

    it("Koa middleware - should authorize correct header", (done) => {
        const app = new Koa();
        const router = new Router();
        const security = useSecurity({} as SingletonService);
        sinon.stub(security, "validate").returns(Promise.resolve(true));

        router.get("/", (ctx, _) => {
            ctx.status = 200;
        });
        app.use(async (ctx, next) => {
            ctx.dependencies = { security };
            await next();
        });
        app.use(validateToken);
        app.use(router.routes());

        request(app.callback())
            .get("/")
            .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
            .expect(200)
            .end(done);
    });
});
