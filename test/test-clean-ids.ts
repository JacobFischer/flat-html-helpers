import { expect } from "chai";
import { cleanIds } from "../src";

describe("cleanIds", () => {
    it("should be a function", async () => {
        expect(cleanIds).to.be.a("function", "cleanIds should be a function");
    });
    it("should require arguments", async () => {
        expect(cleanIds).to.throw(TypeError);
    });
    it("should clean duplicate ids", async () => {
        const uncleanHtml = `
            <hr id="test">
            <hr id="test">`;

        const cleanHtml = `
            <hr id="test">
            <hr id="test-2">`;

        expect(cleanIds(uncleanHtml)).to.equal(cleanHtml, "Did not clean ids from duplicates");
    });
    it("should not clean different ids", async () => {
        const html = `
            <hr id="test">
            <hr id="test2">`;

        expect(cleanIds(html)).to.equal(html, "Ids mutated when they should not have");
    });
    it("should should allow custom duplicate function", async () => {
        const uncleanHtml = `
            <hr id="test">
            <hr id="test">`;

        const cleanHtml = `
            <hr id="test">
            <hr id="test__2">`;

        expect(cleanIds(
            uncleanHtml,
            (id, n) => `${id}__${n}`,
        )).to.equal(cleanHtml, "Did not clean ids from duplicates");
    });
    it("should not mangle id like attributes", async () => {
        const html = `
            <hr cid="test">
            <hr id=test2>
            <id test3>
            <hr i="test4">
            <hr id='test5'>
            <hr idd='test6'>
            <hr id-"test7"`;

        expect(cleanIds(html)).to.equal(html, "Mangled html elements with id like attributes.");
    });
});
