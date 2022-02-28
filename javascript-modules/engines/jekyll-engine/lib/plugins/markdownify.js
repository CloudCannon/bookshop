import kramed from 'kramed';

/**
 * Implementation of Jekyll's jsonify filter
 */
export default function (Liquid) {
    this.registerFilter('markdownify', (input) => {
        return kramed(input ?? "");
    });
}