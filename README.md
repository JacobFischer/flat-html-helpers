# Flat HTML Helpers

This is a utility library primarily focused around quick and dirty HTML edits
from flat sources, such as [Markdown].

When you parse a markdown file that follows a spec, often times the output HTML
is very flat and lacking. This
library is a middle man to help format and generally improve the HTML markup for
use on websites.

**NOTE**: This is **not** a Markdown parser. Instead you can parse your markdown
with whatever your favorite parser
is (I like [marked]), then through the generated HTML trough the util
function(s) here.

## Documentation

Documentation is automatically built and deployed on our GitHub pages site
[here][docs].

[docs]: http://jacobfischer.github.io/flat-html-helpers
[Markdown]: https://en.wikipedia.org/wiki/Markdown
[marked]: https://github.com/markedjs/marked

## Functions

### breakHeaderEms

Injects line breaks before `<em>` tags within header tags.

```ts
const formatted = breakHeaderEms('<h1>Foo <em>Bar</em></h1>');
console.log(formatted); // '<h1>Foo <br /><em>Bar</em></h1>'
```

### cleanIds

Cleans up ids that may have duplicates; by adding a `-N` to the end, or you own
custom formatter.

```ts
const cleaned = cleanIds('<hr id="test"><hr id="test">');
console.log(cleaned); // '<hr id="test"><hr id="test-2">';
```

It also can take an optional `duplicateFormatter` callback to format duplicate
Ids.

```ts
const cleaned = cleanIds(
    '<hr id="test"><hr id="test">',
    (id, n) => `${id}___${n}`,
);
console.log(cleaned); // '<hr id="test"><hr id="test___2">';
```

### sectionize

Nests and wraps flat `<h#>` tags into sections.

```ts
const sectionized = sectionize(`
    <h1>First</h2>
    <p>first content</p>
    <h2>Second</h2>
    <p>second</p>`,
);
console.log(sectionized);
/*
<section class="for-h1">
    <h1>First</h2>
    <div class="h2-content">
        <p>first content</p>
        <section class="for-h2">
            <h2>Second</h2>
            <div class="h2-content">
                <p>second</p>
            </div>
        </section>
    </div>
</section>
*/
```
_Note_: exact whitespace (newlines and indentation) will not be pretty printed
like this example. It was added to enhance readability.
