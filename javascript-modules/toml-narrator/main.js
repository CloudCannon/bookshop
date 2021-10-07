var pkg = require('./package.json');
module.exports = {
    Version: () => pkg.version,
    RewriteTOML: (input_toml) => {
        return input_toml.split(`\n`).map(line => {
            // some_variable.etc = "some value" #: Some comment
            const isVariableComment = /^[a-z0-9\-_\.\s]+=.*?#.+?$/i;
            // [some_section] #: Some comment
            const isBlockComment = /^\s*?\[.*?#.+?$/i;
            const extractComment = /#:([^#]+)$/i;
            const extractVariable = /^\s*?([a-z0-9\-_\.]+)\s?=/i;

            if (isVariableComment.test(line)) {
                const [, comment] = extractComment.exec(line) || [];
                const [, variable_name] = extractVariable.exec(line) || [];
                console.log(comment)
                if (!comment || !variable_name) return line;
                return `${variable_name}--bookshop_comment = "${comment.replace(/"/g, '\"').trim()}"\n${line}`
            } else if (isBlockComment.test(line)) {
                const [, comment] = extractComment.exec(line) || [];
                if (!comment) return line;
                return `${line}\n--bookshop_comment = "${comment.trim()}"`
            } else {
                return line;
            }
        }).join(`\n`);
    }
}
