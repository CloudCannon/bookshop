export const stubExternalPlugin = (name, regex) => {
    return {
        name: name,
        setup(build) {
            build.onResolve({ filter: regex }, args => {
                return { path: args.path, external: true }
            })
        },
    }
}

