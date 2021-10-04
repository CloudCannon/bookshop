import slugify from 'slugify';

/**
 * Liquidjs implementation of Eleventy's slug plugin
 * TODO: Behaviour might differ for complex strings
 */
 export default function (Liquid) {
    this.registerFilter('slug', (text) => {
        if (text && typeof text === 'string') return slugify(text).toLowerCase()
        return text
    });
}