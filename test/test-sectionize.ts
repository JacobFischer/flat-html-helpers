import { expect } from "chai";
import { sectionize } from "../src";

// tslint:disable:max-line-length
const testInput = `
<h1 id="header">Header</h1>
<p>Subtitle</p>
<h2 id="second-level">Second level</h2>
<p>More text</p>
<p>Even more text</p>
<h2 id="another-level">Another level</h2>
<p>Foo bar baz</p>
<h3 id="now-the-third-level">Now the third level</h3>
<p>Is it pizza time?</p>
<p>Yes it is!</p>
<h2 id="back-to-the-third-level">Back to the third level</h2>
<p>More text for that</p>
<h2 id="second-level-again">Second level again</h2>
<h3 id="third-layer">Third layer</h3>
<h4 id="forth-layer">Forth layer</h4>
<p>Done!</p>
`;

const defaultSectionClass = (i: number) => `for-h${i}`;
const defaultContentClass = (i: number) => `h${i}-content`;

const makeTestOutput = (
    sectionClass: (i: number) => string = defaultSectionClass,
    contentClass: (i: number) => string = defaultContentClass,
) => `
<section class="${sectionClass(1)}"><h1 id="header">Header</h1><div class="${contentClass(1)}">
<p>Subtitle</p>
<section class="${sectionClass(2)}"><h2 id="second-level">Second level</h2><div class="${contentClass(2)}">
<p>More text</p>
<p>Even more text</p>
</div></section><section class="${sectionClass(2)}"><h2 id="another-level">Another level</h2><div class="${contentClass(2)}">
<p>Foo bar baz</p>
<section class="${sectionClass(3)}"><h3 id="now-the-third-level">Now the third level</h3><div class="${contentClass(3)}">
<p>Is it pizza time?</p>
<p>Yes it is!</p>
</div></section></div></section><section class="${sectionClass(2)}"><h2 id="back-to-the-third-level">Back to the third level</h2><div class="${contentClass(2)}">
<p>More text for that</p>
</div></section><section class="${sectionClass(2)}"><h2 id="second-level-again">Second level again</h2><div class="${contentClass(2)}">
<section class="${sectionClass(3)}"><h3 id="third-layer">Third layer</h3><div class="${contentClass(3)}">
<section class="${sectionClass(4)}"><h4 id="forth-layer">Forth layer</h4><div class="${contentClass(4)}">
<p>Done!</p>
</div></section></div></section></div></section></div></section>
`;
// tslint:enable:max-line-length

describe("sectionize", () => {
    it("should be a function", () => {
        expect(sectionize).to.be.a("function", "sectionize should be a function");
    });
    it("should require arguments", () => {
        expect(sectionize).to.throw(TypeError);
    });
    it("should wrap flat html with headers to sectionized html", () => {
        expect(
            sectionize(testInput),
        ).to.equal(
            makeTestOutput(),
            "Sections were not created correctly for test html.",
        );
    });
    it("should allow custom section classes", () => {
        const sectionClass = (i: number) => `${i}custom`;
        expect(
            sectionize(testInput, { sectionClass }),
        ).to.equal(
            makeTestOutput(sectionClass),
            "Sections were not created correctly for test html.",
        );
    });
    it("should allow custom content classes", () => {
        const contentClass = (i: number) => `custom_${i}`;
        expect(
            sectionize(testInput, { contentClass }),
        ).to.equal(
            makeTestOutput(undefined, contentClass),
            "Sections were not created correctly for test html.",
        );
    });
});
