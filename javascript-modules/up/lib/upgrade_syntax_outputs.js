import TOML from '@ltd/j-toml';
import YAML from 'yaml';
import util from 'util';

const comment = (type, delim) => {
    let comments = [];
    switch (type) {
        case "spec":
            comments = [`Metadata about this component, to be used in the CMS`];
            break;
        case "blueprint":
            comments = [`Defines the structure of this component, as well as the default values`];
            break;
        case "preview":
            comments = [`Overrides any fields in the blueprint when viewing this component in the component browser`];
            break;
        case "_inputs":
            comments = [`Any extra CloudCannon inputs configuration to apply to the blueprint`];
            break;
    }
    return comments.map(c => `${delim}${c}`).join('\n');
}

const retain_extra_entries = ([key,]) => {
    return !/^spec|blueprint|preview|_inputs$/.test(key);
}

export const buildYAML = (syntax) => {
    const extra_fields = Object.entries(syntax).filter(retain_extra_entries);
    return [
        comment('spec', '# '),
        `${YAML.stringify({ spec: syntax.spec })}`,
        comment('blueprint', '# '),
        `${YAML.stringify({ blueprint: syntax.blueprint })}`,
        comment('preview', '# '),
        `${YAML.stringify({ preview: syntax.preview })}`,
        comment('_inputs', '# '),
        `${YAML.stringify({ _inputs: syntax._inputs })}`,
        extra_fields.length ? extra_fields.map(([key, val]) => {
            return `${YAML.stringify({ [key]: val })}`
        }).join('\n') : "# BOOKSHOP_BLANK_LINE",
    ].join('\n');
}

export const buildTOML = (syntax) => {
    const extra_fields = Object.entries(syntax).filter(retain_extra_entries);
    const extra_base_fields = extra_fields.filter(([, f]) => typeof f !== 'object');
    const extra_base_tables = extra_fields.filter(([, f]) => typeof f === 'object');
    const o = {
        newline: '\n',
        indent: 2,
        newlineAround: 'document',
        xNull: true,
    }
    const strip = t => t.replace(/^\n/g, '');
    return [
        extra_base_fields.length ? extra_base_fields.map(([key, val]) => {
            return `${TOML.stringify({ [key]: val }, o)}`
        }).join('').replace(/^\n/, '') : "# BOOKSHOP_BLANK_LINE",
        comment('spec', '# '),
        `${strip(TOML.stringify({ spec: TOML.Section(syntax.spec) }, o))}`,
        comment('blueprint', '# '),
        `${strip(TOML.stringify({ blueprint: TOML.Section(syntax.blueprint) }, o))}`,
        comment('preview', '# '),
        `${strip(TOML.stringify({ preview: TOML.Section(syntax.preview) }, o))}`,
        comment('_inputs', '# '),
        `${strip(TOML.stringify({ _inputs: TOML.Section(syntax._inputs) }, o))}`,
        extra_base_tables.length ? extra_base_tables.map(([key, val]) => {
            return `${TOML.stringify({ [key]: TOML.Section(val) }, o)}`
        }).join('').replace(/^\n/, '') : "# BOOKSHOP_BLANK_LINE",
    ].join('\n');
}

export const buildJSON = (syntax) => {
    return JSON.stringify(syntax, null, 2) + '\n';
}

export const buildJS = (syntax) => {
    const extra_fields = Object.entries(syntax).filter(retain_extra_entries);
    const o = {
        depth: 100,
        maxArrayLength: Infinity,
        maxStringLength: Infinity,
    };
    const fix = t => t
        .replace(/\n/g, '\n  ')
        .replace(/Object <.+?> {/g, '{');
    return [
        `module.exports = () => {`,
        comment('spec', '  // '),
        `  const spec = ${fix(util.inspect(syntax.spec, o))};\n`,
        comment('blueprint', '  // '),
        `  const blueprint = ${fix(util.inspect(syntax.blueprint, o))};\n`,
        comment('preview', '  // '),
        `  const preview = ${fix(util.inspect(syntax.preview, o))};\n`,
        comment('_inputs', '  // '),
        `  const _inputs = ${fix(util.inspect(syntax._inputs, { ...o, compact: false }))};`,
        `${extra_fields.length ? `\n  const extra_fields = ${fix(util.inspect(Object.fromEntries(extra_fields), { ...o, compact: false }))};\n` : ''}`,
        `  return {\n    spec,\n    blueprint,\n    preview,\n    _inputs,\n${extra_fields.length ? `    ...extra_fields,\n` : ''}  }`,
        `}\n`,
    ].join('\n');
}