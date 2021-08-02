import slugify from 'slugify';

/**
 * Liquidjs implementation of Jekyll's slugify plugin
 * TODO: Behaviour might differ for complex strings
 */
 export default function (Liquid) {
    this.registerFilter('slugify', (text) => {
        if (text && typeof text === 'string') return slugify(text).toLowerCase()
        return text
    });
}