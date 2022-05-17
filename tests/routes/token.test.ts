import request from "supertest";
import useApp from "@tmp/back/app";
import sinon from "sinon";
import { SingletonService } from "@tmp/back/services/singleton-service";
import assert from "assert";
import { TaskService } from "@tmp/back/services/task-service";
import useSecurity from "@tmp/back/security";

const ROUTER_PREFIX = "/api/v1/token";
const TEST_PASSWORD = "test";
const TEST_ACCESS_TOKEN = "totally-not-fake-access-token";
const TEST_REFRESH_TOKEN = "totally-not-fake-refresh-token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should validate when correct creds", (done) => {
        const security = useSecurity({} as SingletonService);
        sinon.stub(security, "login").returns(
            Promise.resolve({
                type: "login",
                tokens: {
                    accessToken: TEST_ACCESS_TOKEN,
                    refreshToken: TEST_REFRESH_TOKEN,
                },
            })
        );

        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: {} as TaskService,
            security: security,
        });
        request(app.callback())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: TEST_PASSWORD,
            })
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.message, "Successfully loged in!");
                assert.notDeepEqual(req.body.accessToken, null);
                assert.notDeepEqual(req.body.refreshToken, null);
            })
            .end(done);
    });

    it("should create password when there is no paswd yet", (done) => {
        const security = useSecurity({} as SingletonService);
        sinon.stub(security, "login").returns(
            Promise.resolve({
                type: "create",
                tokens: {
                    accessToken: TEST_ACCESS_TOKEN,
                    refreshToken: TEST_REFRESH_TOKEN,
                },
            })
        );

        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: {} as TaskService,
            security: security,
        });
        request(app.callback())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: TEST_PASSWORD,
            })
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.message, "Successfully loged in!");
                assert.notDeepEqual(req.body.accessToken, null);
                assert.notDeepEqual(req.body.refreshToken, null);
            })
            .end(done);
    });

    it("should fail when wrong password provided", (done) => {
        const security = useSecurity({} as SingletonService);
        sinon.stub(security, "login").returns(
            Promise.resolve({
                type: "refuse",
                tokens: {
                    accessToken: null,
                    refreshToken: null,
                },
            })
        );

        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: {} as TaskService,
            security: security,
        });
        request(app.callback())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: "wrong-password",
            })
            .expect(401)
            .expect((req) => {
                assert.deepEqual(
                    req.body.message,
                    "Provided password was not correct"
                );
                assert.deepEqual(req.body.accessToken, null);
                assert.deepEqual(req.body.refreshToken, null);
            })
            .end(done);
    });

    it("should fail when no body was provided", (done) => {
        const security = useSecurity({} as SingletonService);

        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: {} as TaskService,
            security: security,
        });
        request(app.callback())
            .post(`${ROUTER_PREFIX}/login`)
            .expect(400)
            .expect((req) => {
                assert.deepEqual(
                    req.body.message,
                    "Bad request! Missing body."
                );
                assert.deepEqual(req.body.accessToken, null);
                assert.deepEqual(req.body.refreshToken, null);
            })
            .end(done);
    });
});
