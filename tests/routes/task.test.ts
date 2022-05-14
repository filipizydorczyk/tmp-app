import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";
import sinon from "sinon";
import useApp from "@tmp/back/app";
import { SingletonService } from "@tmp/back/services/singleton-service";
import request from "supertest";
import assert from "assert";

const ROUTER_PREFIX = "/api/v1/tasks";
const TEST_ID = "totally-not-fake-id";
const TEST_TITLE = "Test title";
const TEST_DATE = "2022-05-12T19:46:25.667Z";

describe.only(`API ${ROUTER_PREFIX}`, () => {
    it("should return all tasks", (done) => {
        const service = useTaskService(useTaskRepository());
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
        });

        request(app.callback())
            .get(ROUTER_PREFIX)
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.content, []);
            })
            .end(done);
    });

    it("should fail creating task with invalid body", (done) => {
        const service = useTaskService(useTaskRepository());
        sinon.stub(service, "createTask").returns(
            Promise.resolve({
                id: TEST_ID,
                title: TEST_TITLE,
                date: TEST_DATE,
                done: false,
            })
        );
        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: service,
        });

        request(app.callback()).post(ROUTER_PREFIX).expect(400).end(done);
    });
    it("should create task", (done) => {
        const service = useTaskService(useTaskRepository());
        sinon.stub(service, "createTask").returns(
            Promise.resolve({
                id: TEST_ID,
                title: TEST_TITLE,
                date: TEST_DATE,
                done: false,
            })
        );
        const app = useApp({
            singletonService: {} as SingletonService,
            taskService: service,
        });

        request(app.callback())
            .post(ROUTER_PREFIX)
            .send({
                id: TEST_ID,
                title: TEST_TITLE,
                date: TEST_DATE,
                done: false,
            })
            .expect(200)
            .end(done);
    });
    it("should update task", (done) => {});
    it("should fail updating with invalid body", (done) => {});
    it("should delete task", (done) => {});
});
