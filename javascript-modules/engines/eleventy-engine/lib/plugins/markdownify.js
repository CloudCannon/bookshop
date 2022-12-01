import kramed from 'kramed';
const MarkdownIt = require("markdown-it"),
    md = new MarkdownIt({
        html: true,
    });

/**
 * Implementation of Eleventy's jsonify filter
 */
export default function (Liquid) {
    this.registerFilter('markdownify', (input) => {
        return md.render(input ?? "")
    });
}
