import bookshopPlugin from '@bookshop/vite-plugin-astro-bookshop'

export default () => {
	return {name: 'bookshop', hooks: {
			'astro:config:setup': ({updateConfig}) => {
				updateConfig({
					vite: {
						plugins: [bookshopPlugin()],
					}
				})
			}}
		}
}