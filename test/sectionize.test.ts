import { sectionize } from "../src";

const testInput = `
<h1 id="header">Header</h1>
<p>Subtitle</p>
<h2 id="second-level">Second level</h2>
<p>More text</p>
<p>Even more text</p>
<hr>
<h2 id="another-level">Another level</h2>
<p>Foo bar baz</p>
<h3 id="now-the-third-level">Now the third level</h3>
<p>Is it pizza time?</p>
<p>Yes it is!</p>
<hr>
<h2 id="back-to-the-third-level">Back to the third level</h2>
<p>More text for that</p>
<h2 id="second-level-again">Second level again</h2>
<h3 id="third-layer">Third layer</h3>
<h4 id="forth-layer">Forth layer</h4>
<p>Done!</p>
`;

const defaultSectionClass = (i: number) => `for-h${i}`;
const defaultContentClass = (i: number) => `h${i}-content`;
const insertHr = (insert: boolean) => (insert ? "<hr>" : "");

// prettier will wrap weird here
// prettier-ignore
const makeTestOutput = (
    sectionClass = defaultSectionClass,
    contentClass = defaultContentClass,
    pushDownHr = false,
) => `
<section class="${sectionClass(1)}"><h1 id="header">Header</h1><div class="${contentClass(1)}">
<p>Subtitle</p>
<section class="${sectionClass(2)}"><h2 id="second-level">Second level</h2><div class="${contentClass(2)}">
<p>More text</p>
<p>Even more text</p>
</div></section>${insertHr(pushDownHr)}<section class="${sectionClass(2)}">${insertHr(!pushDownHr)}
<h2 id="another-level">Another level</h2><div class="${contentClass(2)}">
<p>Foo bar baz</p>
<section class="${sectionClass(3)}"><h3 id="now-the-third-level">Now the third level</h3><div class="${contentClass(3)}">
<p>Is it pizza time?</p>
<p>Yes it is!</p>
</div></section></div></section>${insertHr(pushDownHr)}<section class="${sectionClass(2)}">${insertHr(!pushDownHr)}
<h2 id="back-to-the-third-level">Back to the third level</h2><div class="${contentClass(2)}">
<p>More text for that</p>
</div></section><section class="${sectionClass(2)}"><h2 id="second-level-again">Second level again</h2><div class="${contentClass(2)}">
<section class="${sectionClass(3)}"><h3 id="third-layer">Third layer</h3><div class="${contentClass(3)}">
<section class="${sectionClass(4)}"><h4 id="forth-layer">Forth layer</h4><div class="${contentClass(4)}">
<p>Done!</p>
</div></section></div></section></div></section></div></section>
`;

describe("sectionize", () => {
    test("should be a function", () => {
        expect(typeof sectionize).toBe("function");
    });

    test("should require arguments", () => {
        expect(sectionize).toThrowError(TypeError);
    });

    test("should wrap flat html with headers to sectionized html", () => {
        expect(sectionize(testInput)).toEqual(makeTestOutput());
    });

    test("should allow custom section classes functions", () => {
        const sectionClass = (i: number) => `${i}custom`;
        expect(sectionize(testInput, { sectionClass })).toEqual(
            makeTestOutput(sectionClass),
        );
    });

    test("should allow custom section classes strings", () => {
        const sectionClass = "custom_section";
        expect(sectionize(testInput, { sectionClass })).toEqual(
            makeTestOutput(() => sectionClass),
        );
    });

    test("should allow custom content classes", () => {
        const contentClass = (i: number) => `custom_${i}`;
        expect(sectionize(testInput, { contentClass })).toEqual(
            makeTestOutput(undefined, contentClass),
        );
    });

    test("should not transform empty strings", () => {
        expect(sectionize("")).toEqual("\n");
    });

    test("should push down <hr> tags", () => {
        expect(sectionize(testInput, { pushDownHrs: true })).toEqual(
            makeTestOutput(undefined, undefined, true),
        );
    });
});
