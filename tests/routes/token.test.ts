import request from "supertest";
import useApp, { AppDependencies } from "@tmp/back/app";
import sinon from "sinon";
import useSingletonService from "@tmp/back/services/singleton-service";
import useSingletoRepository from "@tmp/back/repositories/singleton-repo";

const ROUTER_PREFIX = "/api/v1/token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should validate correct creds", async () => {
        const app = useApp(async (ctx, next) => {
            const service = useSingletonService(useSingletoRepository());
            // TODO mock rest used functions so that no actuall database requests are being made
            sinon.stub(service, "comparePasswords").returns(
                new Promise((resolve, _) => {
                    resolve(true);
                })
            );

            ctx.dependencies = {
                singletonService: service,
            } as AppDependencies;
            await next();
        });
        await request(app.listen())
            .post(`${ROUTER_PREFIX}/login`)
            .send({
                password: "test",
            })
            .expect(200);
    });
});
