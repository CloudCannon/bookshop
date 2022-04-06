import { fileURLToPath } from "url";
import path from 'path';

export const __filename = u => fileURLToPath(u);
export const __dirname = u => path.dirname(__filename(u));
export const plur = (num, str, pluralStr) => {
    const pluralized = num === 1 ? str : (pluralStr ?? `${str}s`);
    return `${num} ${pluralized}`;
}

export const rewriteLegacyToml = (input_toml) => {
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