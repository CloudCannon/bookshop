import { version as ReactVersion } from "react-dom";

export default async () => ({
	name: "@bookshop/react",
	clientEntrypoint: ReactVersion.startsWith("18.")
		? "@astrojs/react/client.js"
		: "@astrojs/react/client-v17.js",
	serverEntrypoint: ReactVersion.startsWith("18.")
		? "@bookshop/astro-bookshop/react/server.js"
		: "@astrojs/react/server-v17.js",
	jsxImportSource: "react",
	jsxTransformOptions: async () => {
		// @ts-expect-error types not found
		const babelPluginTransformReactJsxModule = await import(
			"@babel/plugin-transform-react-jsx"
		);
		const jsx =
			babelPluginTransformReactJsxModule?.default?.default ??
			babelPluginTransformReactJsxModule?.default;
		return {
			plugins: [
				jsx(
					{},
					{
						runtime: "automatic",
						// This option tells the JSX transform how to construct the "*/jsx-runtime" import.
						// In React v17, we had to shim this due to an export map issue in React.
						// In React v18, this issue was fixed and we can import "react/jsx-runtime" directly.
						// See `./jsx-runtime.js` for more details.
						importSource: ReactVersion.startsWith("18.")
							? "react"
							: "@astrojs/react",
					}
				),
			],
		};
	},
})