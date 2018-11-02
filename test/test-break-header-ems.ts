import { expect } from "chai";
import { breakHeaderEms } from "../src";

const LEVELS = [1, 2, 3, 4, 5, 6];
const makeTestHtml = (br: (n: number) => string = () => "<br />") => ({
    input: LEVELS.map((n) => `<h${n}>Foo <em>Bar</em></h${n}>`).join("\n"),
    output: LEVELS.map((n) => `<h${n}>Foo ${br(n)}<em>Bar</em></h${n}>`).join("\n"),
});

describe("breakHeaderEms", () => {
    it("should be a function", () => {
        expect(breakHeaderEms).to.be.a("function", "breakHeaderEms should be a function");
    });
    it("should require arguments", () => {
        expect(breakHeaderEms).to.throw(TypeError);
    });
    it("should break <em> in headers", () => {
        const { input, output } = makeTestHtml();

        expect(breakHeaderEms(input)).to.equal(output, "Did not insert a <br /> before <em>");
    });
    it("should allow for <br> breaks", () => {
        const { input, output } = makeTestHtml(() => "<br>");

        expect(breakHeaderEms(
            input ,
            { noEndTag: true }),
        ).to.equal(output, "Did not insert a <br> before <em>");
    });
    it("should only insert <br />s on custom levels", () => {
        const levels = [2, 3];
        const { input, output } = makeTestHtml((n) => levels.includes(n) ? "<br />" : "");

        expect(breakHeaderEms(input, { levels })).to.equal(output, "Did not insert a <br /> before <em>");
    });
    it("should only insert <br />s on a single level", () => {
        const level = 6;
        const { input, output } = makeTestHtml((n) => level === n ? "<br />" : "");

        expect(breakHeaderEms(input, { level })).to.equal(output, "Did not insert a <br /> before <em>");
    });
    it("should only allow combining options", () => {
        const level = 1;
        const { input, output } = makeTestHtml((n) => level === n ? "<br>" : "");

        expect(breakHeaderEms(input, { level, noEndTag: true })).to.equal(output, "Did not insert a <br> before <em>");
    });
});
