import { expect } from "chai";

describe("Sanity", () => {
    it("should be sane", () => {
        expect(true).to.equal(true, "true should be true!");
        expect(false).to.equal(false, "false should be false!");
    });
    it("should not be insane", () => {
        expect(true).is.not.equal(false, "true should not equal false!");
        expect(false).is.not.equal(true, "false should not equal true!");
    });
});
