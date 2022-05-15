import assert from "assert";
import jwt from "jsonwebtoken";

describe.only(`Security tests`, () => {
    it("should", () => {
        const token = jwt.sign({ password: "lmao" }, "test", {
            expiresIn: "15m",
        });
        jwt.verify(`${token}-xD`, "test", (err, user) => {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", user);
            }
        });
    });
});
