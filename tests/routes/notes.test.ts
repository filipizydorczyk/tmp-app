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
import request from "supertest";
import useApp from "@tmp/back/app";
import sinon from "sinon";
import useSingletonService, {
    SingletonService,
} from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import assert from "assert";
import { NotesDTO } from "@tmp/back/dto";
import { TaskService } from "@tmp/back/services/task-service";
import useSecurity from "@tmp/back/security";
import withDatabase from "../tests-utils";

const ROUTER_PREFIX = "/api/v1/notes";
const TEST_NOTE = "Hello world!";
const TEST_ACCESS_TOKEN = "totally-not-fake-token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should return note", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .get(`${ROUTER_PREFIX}`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(200)
                .expect((req) => {
                    assert.deepEqual(
                        req.body.message,
                        "Notes sucessfully fetched"
                    );
                    assert.deepEqual(req.body.content, TEST_NOTE);
                })
                .end(done);
        });
    });

    it("should note return note due to a missing auth header", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            const getNotesSpy = sinon
                .stub(service, "getNotes")
                .returns(Promise.resolve(TEST_NOTE));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .get(`${ROUTER_PREFIX}`)
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(getNotesSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should return empy string when note is null", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            sinon.stub(service, "getNotes").returns(Promise.resolve(null));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .get(`${ROUTER_PREFIX}`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(200)
                .expect((req) => {
                    assert.deepEqual(
                        req.body.message,
                        "Notes sucessfully fetched"
                    );
                    assert.deepEqual(req.body.content, "");
                })
                .end(done);
        });
    });

    it("should fail when no body was provided", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .post(`${ROUTER_PREFIX}`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .expect(400)
                .expect((req) => {
                    assert.deepEqual(req.body.message, "No body was provided");
                    assert.deepEqual(req.body.content, null);
                })
                .end(done);
        });
    });

    it("should return newly saved note", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            const saveNotesSpy = sinon
                .stub(service, "saveNotes")
                .returns(Promise.resolve(true));
            sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .post(`${ROUTER_PREFIX}`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .send({ content: TEST_NOTE } as NotesDTO)
                .expect(200)
                .expect((req) => {
                    assert.deepEqual(
                        req.body.message,
                        "Notes sucessfully updated"
                    );
                    assert.deepEqual(req.body.content, TEST_NOTE);
                    assert.deepEqual(saveNotesSpy.callCount, 1);
                })
                .end(done);
        });
    });

    it("should note return newly saved note due to a missingauth header", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            const saveNotesSpy = sinon
                .stub(service, "saveNotes")
                .returns(Promise.resolve(true));
            const getNoetsSpy = sinon
                .stub(service, "getNotes")
                .returns(Promise.resolve(TEST_NOTE));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .post(`${ROUTER_PREFIX}`)
                .send({ content: TEST_NOTE } as NotesDTO)
                .expect(400)
                .expect((_) => {
                    assert.deepEqual(saveNotesSpy.callCount, 0);
                    assert.deepEqual(getNoetsSpy.callCount, 0);
                })
                .end(done);
        });
    });

    it("should throw 500 if database request failed", (done) => {
        withDatabase(async ({ path }) => {
            const service = useSingletonService(useSingletonRepository(path));
            const security = useSecurity({} as SingletonService);
            sinon.stub(security, "validate").returns(Promise.resolve(true));
            const saveNotesSpy = sinon.stub(service, "saveNotes").returns(
                new Promise((resolve, _) => {
                    resolve(false);
                })
            );
            sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

            const app = useApp({
                singletonService: service,
                taskService: {} as TaskService,
                security,
            });
            request(app.callback())
                .post(`${ROUTER_PREFIX}`)
                .set({ Authorization: `Bearer ${TEST_ACCESS_TOKEN}` })
                .send({ content: TEST_NOTE } as NotesDTO)
                .expect(500)
                .expect((req) => {
                    assert.deepEqual(
                        req.body.message,
                        "We werent able to save this note"
                    );
                    assert.deepEqual(req.body.content, null);
                    assert.deepEqual(saveNotesSpy.callCount, 1);
                })
                .end(done);
        });
    });
});
