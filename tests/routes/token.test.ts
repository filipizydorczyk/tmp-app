import request from "supertest";
import useApp from "@tmp/back/app";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";

const ROUTER_PREFIX = "/api/v1/token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should validate correct creds", async () => {
        const service = useSingletonService(useSingletonRepository());
        // TODO mock rest used functions so that no actuall database requests are being made
        sinon.stub(service, "comparePasswords").returns(
            new Promise((resolve, _) => {
                resolve(true);
            })
        );
        const app = useApp({ singletonService: service });

        await request(app.listen())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: "test",
            })
            .expect(200);
    });
});
