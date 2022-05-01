import request from "supertest";
import useApp from "@tmp/back/app";

const ROUTER_PREFIX = "/api/v1/token";

describe(`API ${ROUTER_PREFIX}`, () => {
    it("should validate correct creds", async () => {
        const app = useApp(async (ctx, next) => {
            ctx.dependencies = {
                singletonService: {
                    getPassword: () => "test",
                    setPassword: () => true,
                    comparePasswords: () => true,
                },
            };
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
