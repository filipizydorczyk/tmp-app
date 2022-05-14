import assert from "assert";
import {
    TaskDTO,
    NewTaskDTO,
    isNewTaskDTOValid,
    isTaskDTOValid,
} from "@tmp/back/dto";

const TEST_ID = "totally-not-fake-id";
const TEST_TITLE = "Test title";
const TEST_DATE = "2022-05-12T19:46:25.667Z";

describe(`Task dtos body validation`, () => {
    it("TaskDTO - should validate correct body", () => {
        const body = {
            id: TEST_ID,
            title: TEST_TITLE,
            date: TEST_DATE,
            done: false,
        } as TaskDTO;

        assert.ok(isTaskDTOValid(body));
    });
    it.only("TaskDTO - should refuse incorrect field values", () => {
        const body = {
            id: TEST_ID,
            title: 123,
            date: TEST_DATE,
            done: false,
        } as unknown as TaskDTO;

        assert.ok(!isTaskDTOValid(body));
    });
    it("TaskDTO - should refuse when fileds are missing", () => {
        const body = {
            id: TEST_ID,
            date: TEST_DATE,
            done: false,
        } as unknown as TaskDTO;

        assert.ok(!isTaskDTOValid(body));
    });
    it("NewTaskDTO - should validate correct body", () => {});
    it("NewTaskDTO - should refuse incorrect field values", () => {});
    it("NewTaskDTO - should refuse when fileds are missing", () => {});
});
