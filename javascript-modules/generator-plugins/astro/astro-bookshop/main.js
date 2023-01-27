import bookshopVite from '@bookshop/vite-plugin-astro-bookshop'
import bookshopRemark from '@bookshop/remark-plugin-astro-bookshop'

export default () => {
	return {name: 'bookshop', hooks: {
			'astro:config:setup': ({updateConfig}) => {
				updateConfig({
					markdown: {
						remarkPlugins:[bookshopRemark]
					},
					vite: {
						plugins: [bookshopVite()],
					}
				})
			}}
		}
}