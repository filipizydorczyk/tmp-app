import assert from "assert";
import { isIsoDate } from "@tmp/back/utils";

describe(`Utils tests`, () => {
    it("should validate correct iso string", () => {
        assert.ok(isIsoDate("2022-05-12T19:46:25.667Z"));
    });

    it("should invalidate incorrect iso string", () => {
        assert.ok(!isIsoDate("2022-05-12T19:46:25.667X"));
    });
    it("should invalidate nonsense string", () => {
        assert.ok(!isIsoDate("fasdfsdf"));
    });
    it("should invalidate empty string", () => {
        assert.ok(!isIsoDate(""));
    });
});
