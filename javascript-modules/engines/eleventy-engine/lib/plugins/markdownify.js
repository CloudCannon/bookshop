import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({
    html: true,
});

/**
 * Implementation of a common markdownify filter
 */
export default function (Liquid) {
    this.registerFilter('markdownify', (input) => {
        return md.render(input ?? "")
    });
}
