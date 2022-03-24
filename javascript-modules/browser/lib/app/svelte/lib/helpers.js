import toml from '@ltd/j-toml';
import yaml from 'js-yaml';

export const getBookshopKey = (path) => {
    let base = path.replace(/^.*components\//, '').split(".")[0];
    let parts = base.split("/");
    const l = parts.length;
    if (l >= 2 && parts[l - 1] === parts[l - 2]) {
        parts.pop();
        base = parts.join("/");
    }
    return base;
}

const applyPreview = (blueprint, preview) => {
    if (!blueprint) return blueprint;
    for (const key of Object.keys(preview)) {
        if (Array.isArray(preview[key]) && Array.isArray(blueprint[key])) {
            blueprint[key] = [blueprint[key][0]];
            for (let i = 0; i < preview[key].length - 1; i++) {
                blueprint[key].push(JSON.parse(JSON.stringify(blueprint[key][0])));
            }
        }
        if (typeof preview[key] === "object") {
            Object.assign(preview[key], applyPreview(blueprint[key], preview[key]))
        }
    }

    Object.assign(blueprint || {}, preview)
    return blueprint
}

export const hydrateComponents = (components, engines, exclude = []) => {
    const hydrated = {};
    hydrated['all_bookshop'] = {
        identity: {
            label: "All Components",
            icon: "menu_book"
        },
        frameworks: engines.map(engine => engine.key)
    }
    Object.entries(components).forEach(([path, component]) => {
        const filetype = path.split('.').reverse()[0];
        let parsedComponent;

        try {
            switch (filetype) {
                case "toml":
                    parsedComponent = toml.parse(component ?? "", 1, "\n", false);
                    break;
                case "yml":
                case "yaml":
                    parsedComponent = yaml.load(component ?? "");
                    break;
                case "json":
                    parsedComponent = JSON.parse(component ?? "");
                    break;
                case "js":
                    if (typeof component === "function") {
                        parsedComponent = component();
                    } else {
                        parsedComponent = component;
                    }
                    break;
                default:
                    console.error(`Unknown component filetype ${filetype}`);
                    return;
            }
        } catch (e) {
            console.error(`Failed to load ${path}`);
            console.error(e.toString());
            return;
        }

        if (!parsedComponent?.blueprint) {
            console.error(`Component ${path} does not have a blueprint`);
            return
        };

        if (exclude?.length) {
            let excludedTags = parsedComponent?.spec?.tags?.filter(tag => exclude.indexOf(tag) >= 0);
            if (excludedTags?.length) return;
        }

        const componentKey = getBookshopKey(path);
        const mergedProps = applyPreview(parsedComponent?.blueprint || {}, parsedComponent?.preview || {});

        let componentYaml = "# No props";
        if (mergedProps && Object.keys(mergedProps).length) {
            componentYaml = yaml.dump(mergedProps, {
                noRefs: true
            });
        }

        const matchedFrameworks = engines.filter(engine => engine.hasComponent(componentKey)).map(engine => engine.key);
        if (matchedFrameworks.length) {
            hydrated[componentKey] = {
                identity: parsedComponent.spec,
                props: mergedProps,
                yaml: componentYaml,
                frameworks: matchedFrameworks
            }
        }
    });
    return hydrated;
}

export const loadYaml = (yamlProps) => {
    let props = {}, err = false;
    if (typeof yamlProps === 'string') {
        try {
            props = yaml.load(yamlProps);
        } catch (e) {
            props = {};
            err = true;
            console.log(e);
        }
    }
    return { props, err };
}

export const updateUrl = (component, framework) => {
    const currentURL = new URL(window.location);
    currentURL.hash = `${component}:${framework}`;
    window.history.replaceState({}, "", currentURL);
}