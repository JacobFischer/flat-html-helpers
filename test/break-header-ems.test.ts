import { breakHeaderEms } from "../src";

const LEVELS = [1, 2, 3, 4, 5, 6];
const makeTestHtml = (br: (n: number) => string = () => "<br />") => ({
    input: LEVELS.map((n) => `<h${n}>Foo <em>Bar</em></h${n}>`).join("\n"),
    output: LEVELS.map((n) => `<h${n}>Foo ${br(n)}<em>Bar</em></h${n}>`).join(
        "\n",
    ),
});

describe("breakHeaderEms", () => {
    test("should be a function", () => {
        expect(typeof breakHeaderEms).toBe("function");
    });

    test("should require arguments", () => {
        expect(breakHeaderEms).toThrowError(TypeError);
    });

    test("should break <em> in headers", () => {
        const { input, output } = makeTestHtml();

        expect(breakHeaderEms(input)).toEqual(output);
    });

    test("should allow for <br> breaks", () => {
        const { input, output } = makeTestHtml(() => "<br>");

        expect(breakHeaderEms(input, { noEndTag: true })).toEqual(output);
    });

    test("should only insert <br />s on custom levels", () => {
        const levels = [2, 3];
        const { input, output } = makeTestHtml((n) =>
            levels.indexOf(n) > -1 ? "<br />" : "",
        );

        expect(breakHeaderEms(input, { levels })).toEqual(output);
    });

    test("should only insert <br />s on a single level", () => {
        const level = 6;
        const { input, output } = makeTestHtml((n) =>
            level === n ? "<br />" : "",
        );

        expect(breakHeaderEms(input, { level })).toEqual(output);
    });

    test("should only allow combining options", () => {
        const level = 1;
        const { input, output } = makeTestHtml((n) =>
            level === n ? "<br>" : "",
        );

        expect(breakHeaderEms(input, { level, noEndTag: true })).toEqual(
            output,
        );
    });
});
