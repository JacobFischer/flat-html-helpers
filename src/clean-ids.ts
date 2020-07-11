const defaultDuplicateFormatter = (id: string, n: number) => `${id}-${n}`;

/**
 * Cleans all the ids in a given html string, making sure no duplicate ids are
 * found.
 *
 * If duplicates are found a number is appended, e.g. "dup" -> "dup2".
 *
 * @param html - The html to clean of ids.
 * @param duplicateFormatter - An optional formatter that takes an id and
 * number (>=2) that returns the new id.
 * **NOTE**: This does not check to ensure you don't return re-duplicate ids.
 * It assumes you take the number and use it.
 * @returns A new html string with no duplicate ids.
 */
export function cleanIds(
    html: string,
    duplicateFormatter: (
        id: string,
        n: number,
    ) => string = defaultDuplicateFormatter,
): string {
    const ids: { [key: string]: number } = {};

    return html.replace(/id="([^"]*)"/g, (s) => {
        const id = s.slice(4, s.length - 1); // 4 from `id="`
        const n = (ids[id] || 0) + 1;
        ids[id] = n;

        return `id="${n > 1 ? duplicateFormatter(id, n) : id}"`;
    });
}
