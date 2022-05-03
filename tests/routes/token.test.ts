import request from "supertest";
import useApp from "@tmp/back/app";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import assert from "assert";

const ROUTER_PREFIX = "/api/v1/token";
const TEST_PASSWORD = "test";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should validate when correct creds", (done) => {
        const service = useSingletonService(useSingletonRepository());
        sinon.stub(service, "comparePasswords").returns(
            new Promise((resolve, _) => {
                resolve(true);
            })
        );
        sinon.stub(service, "getPassword").returns(
            new Promise((resolve, _) => {
                resolve(TEST_PASSWORD);
            })
        );
        sinon.stub(service, "setPassword").returns(
            new Promise((resolve, _) => {
                resolve(true);
            })
        );

        const app = useApp({ singletonService: service });
        request(app.callback())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: TEST_PASSWORD,
            })
            .expect(200)
            .end(done);
    });

    it("should create password when there is no paswd yet", (_) => {
        assert(false);
    });

    it("should fail when wrong password provided", (_) => {
        assert(false);
    });
});
