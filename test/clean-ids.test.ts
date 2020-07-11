import { cleanIds } from "../src";

describe("cleanIds", () => {
    it("should be a function", () => {
        expect(typeof cleanIds).toBe("function");
    });

    it("should require arguments", () => {
        expect(cleanIds).toThrowError(TypeError);
    });

    it("should clean duplicate ids", () => {
        const uncleanHtml = `
            <hr id="test">
            <hr id="test">`;

        const cleanHtml = `
            <hr id="test">
            <hr id="test-2">`;

        expect(cleanIds(uncleanHtml)).toEqual(cleanHtml);
    });

    it("should not clean different ids", () => {
        const html = `
            <hr id="test">
            <hr id="test2">`;

        expect(cleanIds(html)).toEqual(html);
    });

    it("should should allow custom duplicate function", () => {
        const uncleanHtml = `
            <hr id="test">
            <hr id="test">`;

        const cleanHtml = `
            <hr id="test">
            <hr id="test__2">`;

        expect(cleanIds(uncleanHtml, (id, n) => `${id}__${n}`)).toEqual(
            cleanHtml,
        );
    });

    it("should not mangle id like attributes", () => {
        const html = `
            <hr cid="test">
            <hr id=test2>
            <id test3>
            <hr i="test4">
            <hr id='test5'>
            <hr idd='test6'>
            <hr id-"test7"`;

        expect(cleanIds(html)).toEqual(html);
    });
});
