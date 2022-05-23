import assert from "assert";
import { RefreshDTO, isRefreshDTOValid } from "@tmp/back/dto";

describe(`Refresh dtos body validation`, () => {
    it("TaskDTO - should validate correct body", () => {
        const validDTO = {
            refreshToken: "totally-correct-token",
        } as RefreshDTO;

        assert.ok(isRefreshDTOValid(validDTO));
    });

    it("TaskDTO - shouldnt validate empty body", () => {
        const invalidDTO = {} as RefreshDTO;

        assert.ok(!isRefreshDTOValid(invalidDTO));
    });

    it("TaskDTO - shouldnt validate null", () => {
        const invalidDTO = null as unknown as RefreshDTO;

        assert.ok(!isRefreshDTOValid(invalidDTO));
    });

    it("TaskDTO - shouldnt validate undefined", () => {
        const invalidDTO = undefined as unknown as RefreshDTO;

        assert.ok(!isRefreshDTOValid(invalidDTO));
    });
});
