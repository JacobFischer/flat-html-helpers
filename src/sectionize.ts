const defaultSectionClass = (level: number) => `for-h${level}`;
const defaultContentClass = (level: number) => `h${level}-content`;

/**
 * Polyfill for String.repeat.
 *
 * @param str - String to repeat.
 * @param count - Number of times to repeat.
 * @returns The str repeated count times.
 */
function repeat(str: string, count: number): string {
    if (count === 0) {
        return "";
    }

    return count > 1 ? str + repeat(str, count - 1) : str;
}

/**
 * Ensures a value is a string formatter function.
 *
 * @param val - The value to ensure.
 * @param defaultFunction - A default function to use in case of no match.
 * @returns A valid function.
 */
function ensureFunction(
    val: string | undefined | ((level: number) => string),
    defaultFunction: (level: number) => string,
): (level: number) => string {
    switch (typeof val) {
        case "function":
            return val;
        case "string":
            return () => val;
        default:
            return defaultFunction;
    }
}

/**
 * Wraps a flat HTML structure in sections and divs based on h1, h2, etc levels.
 *
 * @param html - The already parsed html to parse. Probably from a
 * markdown source.
 * @param options - Options for how to format the sections.
 * @param options.sectionClass - Function that returns the class attribute
 * for new sections.
 * @param options.contentClass - Function that returns the class attribute for
 * new content divs.
 * @param options.levels - The list of level(s) to sectionize., e.g. [2, 3] for
 * h2, h3.
 * @param options.pushDownHrs - Push down `<hr>` tags that are above a `<h#>`
 * tag to after the section.
 * @returns A new html string from the source, now wrapped in sections.
 */
export function sectionize(
    html: string,
    options: {
        /** Function that returns the class attribute for new sections. */
        sectionClass?: string | ((level: number) => string);
        /** Function that returns the class attribute for new content divs. */
        contentClass?: string | ((level: number) => string);
        /** The list of level(s) to sectionize., e.g. [2, 3] for h2, h3. */
        levels?: number[];
        /** Push down <hr> tags that are above a <hn> tag to after the section. */
        pushDownHrs?: boolean;
    } = {},
): string {
    const sectionClass = ensureFunction(
        options.sectionClass,
        defaultSectionClass,
    );
    const contentClass = ensureFunction(
        options.contentClass,
        defaultContentClass,
    );
    const levels = (options.levels || [1, 2, 3, 4, 5, 6]).join("|");
    const stack: number[] = [];

    // First, wrap all sections, and their contents, into sections and divs for easier styling
    return (
        html
            .replace(new RegExp(`(<hr>\\n)?<h([${levels}]).*?>`, "g"), (s) => {
                const hr =
                    options.pushDownHrs && s.indexOf("<hr>") === 0
                        ? "<hr>"
                        : "";

                const header = options.pushDownHrs
                    ? s.replace("<hr>", "") // remove the hr, so we have only the header
                    : s;

                const headerMatch = new RegExp(`<h([${levels}])`);
                const levelMatch = headerMatch.exec(header);
                /* istanbul ignore if */
                if (!levelMatch) {
                    throw new Error(
                        `Error parsing header for level: ${header}`,
                    );
                }
                const level = Number(levelMatch[1]);

                const last = stack[stack.length - 1];
                const section = `${hr}<section class="${sectionClass(
                    level,
                )}">${header}`;

                if (!last || level > last) {
                    stack.push(level);

                    return section;
                } else {
                    // level < last, so we are going out of the current level
                    const diff = last - level;
                    stack.length = Math.max(0, stack.length - diff);

                    return repeat("</div></section>", diff + 1) + section;
                }
            })
            // Add the div for the contents as mentioned above
            .replace(
                new RegExp(`<\\/h([${levels}])>`, "g"),
                (s) => `${s}<div class="${contentClass(Number(s[3]))}">`,
            ) +
        // Finally close all elements we added in above, to "finish" the html
        repeat("</div></section>", stack.length) +
        "\n"
    );
}
