/**
 * Inserts `<br>` tags into `<h#>` header tags before any `<em>` tags.
 *
 * @param html - The html to parse.
 * @param options - The options for which level(s) for headers to parse.
 * @returns The original html but with now `<br>` tags after headers.
 */
export function breakHeaderEms(
    html: string,
    options: { noEndTag?: boolean } & (
        | { level?: number }
        | { levels?: number[] }
    ) = {},
): string {
    const br = options.noEndTag ? "<br>" : "<br />";

    let levels = [1, 2, 3, 4, 5, 6];
    if ("level" in options && typeof options.level === "number") {
        levels = [options.level];
    } else if ("levels" in options && options.levels) {
        levels = options.levels;
    }

    // If a <h1-6> has an emphasis <em> sub tag, place a <br/> before it.
    let formatted = html;
    for (const level of levels) {
        const regex = new RegExp(`<h${level}(.+?)<em(.+?)/h${level}>`, "g");
        formatted = formatted.replace(regex, (s) =>
            s.replace(/<em/g, (sub) => br + sub),
        );
    }

    return formatted;
}
