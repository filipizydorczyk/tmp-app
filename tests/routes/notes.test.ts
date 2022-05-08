import request from "supertest";
import useApp from "@tmp/back/app";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import assert from "assert";
import { NotesDTO } from "@tmp/back/routes/notes";

const ROUTER_PREFIX = "/api/v1/notes";
const TEST_NOTE = "Hello world!";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should return note", (done) => {
        const service = useSingletonService(useSingletonRepository());
        sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

        const app = useApp({ singletonService: service });
        request(app.callback())
            .get(`${ROUTER_PREFIX}`)
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.message, "Notes sucessfully fetched");
                assert.deepEqual(req.body.content, TEST_NOTE);
            })
            .end(done);
    });

    it("should return empy string when note is null", (done) => {
        const service = useSingletonService(useSingletonRepository());
        sinon.stub(service, "getNotes").returns(Promise.resolve(null));

        const app = useApp({ singletonService: service });
        request(app.callback())
            .get(`${ROUTER_PREFIX}`)
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.message, "Notes sucessfully fetched");
                assert.deepEqual(req.body.content, "");
            })
            .end(done);
    });

    it("should fail when no body was provided", (done) => {
        const service = useSingletonService(useSingletonRepository());

        const app = useApp({ singletonService: service });
        request(app.callback())
            .post(`${ROUTER_PREFIX}`)
            .expect(400)
            .expect((req) => {
                assert.deepEqual(req.body.message, "No body was provided");
                assert.deepEqual(req.body.content, null);
            })
            .end(done);
    });

    it("should return newly saved note", (done) => {
        const service = useSingletonService(useSingletonRepository());
        const saveNotesSpy = sinon
            .stub(service, "saveNotes")
            .returns(Promise.resolve(true));
        sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

        const app = useApp({ singletonService: service });
        request(app.callback())
            .post(`${ROUTER_PREFIX}`)
            .send({ content: TEST_NOTE } as NotesDTO)
            .expect(200)
            .expect((req) => {
                assert.deepEqual(req.body.message, "Notes sucessfully updated");
                assert.deepEqual(req.body.content, TEST_NOTE);
                assert.deepEqual(saveNotesSpy.callCount, 1);
            })
            .end(done);
    });

    it("should throw 500 if database request failed", (done) => {
        const service = useSingletonService(useSingletonRepository());
        const saveNotesSpy = sinon.stub(service, "saveNotes").returns(
            new Promise((resolve, _) => {
                resolve(false);
            })
        );
        sinon.stub(service, "getNotes").returns(Promise.resolve(TEST_NOTE));

        const app = useApp({ singletonService: service });
        request(app.callback())
            .post(`${ROUTER_PREFIX}`)
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
