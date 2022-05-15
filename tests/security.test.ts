import assert from "assert";
import jwt from "jsonwebtoken";

describe.only(`Security tests`, () => {
    it("should login with correct creadentials", () => {});
    it("should create passwrod if there is no password yet", () => {});
    it("should reject if password is incorect", () => {});
    it("should validate correct token", () => {});
    it("should invalidate incorrect token", () => {});
    it("should logout", () => {});
    it("should not logout if refresh token doesnt exist", () => {});
    it("should refresh token", () => {});
    it("should fail refreshing with incorect token", () => {});
});
