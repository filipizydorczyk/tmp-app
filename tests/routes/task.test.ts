/**
 * As u can see I am not testsing here if request will fail
 * when wrong token is provided. This file is basically testing
 * if endpoints are restricted at all that being `validateToken`
 * missleware is used on them. Actuall tests of this middleware
 * are written in `tests/security.test.ts` and thats place where
 * that is being tested. I basically dont repet this test for
 * every route
 *
 * @author Filip Izydorczyk
 */
import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";
import sinon from "sinon";
import useApp from "@tmp/back/app";
import { SingletonService } from "@tmp/back/services/singleton-service";
import request from "supertest";
import assert from "assert";
import useSecurity from "@tmp/back/security";
import withDatabase from "../tests-utils";

const ROUTER_PREFIX = "/api/v1/tasks";
const TEST_ID = "totally-not-fake-id";
const TEST_TITLE = "Test title";
const TEST_DATE = "2022-05-12T19:46:25.667Z";
const TEST_ACCESS_TOKEN = "totally-not-fake-token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should return all tasks", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "getTasks").returns(
                Promise.resolve({
                    page: 0,
                    pages: 1,
                    content: [],
                    total: 0,
                    size: 0,
                })
            );
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .get(ROUTER_PREFIX)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(200)
                .expect((req) => {
                    assert.deepEqual(req.body.content, []);
                })
                .end(done);
        });
    });

    it("should not return all tasks due to missing auth header", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            const getTaskSpy = sinon.stub(service, "getTasks").returns(
                Promise.resolve({
                    page: 0,
                    pages: 1,
                    content: [],
                    total: 0,
                    size: 0,
                })
            );
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .get(ROUTER_PREFIX)
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(getTaskSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should fail creating task with invalid body", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "createTask").returns(
                Promise.resolve({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                    today: false,
                })
            );
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .post(ROUTER_PREFIX)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(400)
                .end(done);
        });
    });

    it("should create task", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "createTask").returns(
                Promise.resolve({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                    today: false,
                })
            );
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .post(ROUTER_PREFIX)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .send({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                })
                .expect(200)
                .end(done);
        });
    });

    it("should not create task due to auth header missing", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            const createTaskSpy = sinon.stub(service, "createTask").returns(
                Promise.resolve({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                    today: false,
                })
            );
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .post(ROUTER_PREFIX)
                .send({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                })
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(createTaskSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should update task", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "updateTask").returns(Promise.resolve(true));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .put(ROUTER_PREFIX)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .send({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                    today: false,
                })
                .expect(200)
                .end(done);
        });
    });

    it("should not update task due to missing auth header", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            const updateTaskSpy = sinon
                .stub(service, "updateTask")
                .returns(Promise.resolve(true));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .put(ROUTER_PREFIX)
                .send({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                })
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(updateTaskSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should fail updating with invalid body", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "updateTask").returns(Promise.resolve(true));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback()).put(ROUTER_PREFIX).expect(400).end(done);
        });
    });

    it("should throw 500 when database operation failed", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "updateTask").returns(Promise.resolve(false));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .put(ROUTER_PREFIX)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .send({
                    id: TEST_ID,
                    title: TEST_TITLE,
                    date: TEST_DATE,
                    done: false,
                    today: false,
                })
                .expect(500)
                .end(done);
        });
    });

    it("should delete task", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "deleteTask").returns(Promise.resolve(true));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .delete(`${ROUTER_PREFIX}/1`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(200)
                .end(done);
        });
    });

    it("should not delete task due to missing auth header", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            const deleteTaskSpy = sinon
                .stub(service, "deleteTask")
                .returns(Promise.resolve(true));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .delete(`${ROUTER_PREFIX}/1`)
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(deleteTaskSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should throw 500 when delete service failed", (done) => {
        withDatabase(async ({ path }) => {
            const service = useTaskService(useTaskRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "deleteTask").returns(Promise.resolve(false));
            const app = useApp({
                singletonService: {} as SingletonService,
                taskService: service,
                security,
            });

            request(app.callback())
                .delete(`${ROUTER_PREFIX}/1`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(500)
                .end(done);
        });
    });
});
