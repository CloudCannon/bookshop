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
            if (typeof blueprint[key] === "object") {
                Object.assign(preview[key], applyPreview(blueprint[key], preview[key]));
            } else {
                blueprint[key] = preview[key];
            }
        }
    }

    Object.assign(blueprint || {}, preview);
    return blueprint;
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

    const structures = {};
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
        const mergedProps = {
            _bookshop_name: componentKey,
            ...applyPreview(parsedComponent?.blueprint || {}, parsedComponent?.preview || {})
        };

        for (const structure of (parsedComponent?.spec?.structures || [])) {
            structures[structure] = structures[structure] || [];
            structures[structure].push({
                props: JSON.parse(JSON.stringify(mergedProps)),
            });
        }
        structures[`component:${componentKey}`] = [{
            props: JSON.parse(JSON.stringify(mergedProps)),
        }]

        const matchedFrameworks = engines.filter(engine => engine.hasComponent(componentKey)).map(engine => engine.key);
        if (matchedFrameworks.length) {
            hydrated[componentKey] = {
                identity: parsedComponent.spec,
                props: mergedProps,
                yaml: "# No props",
                frameworks: matchedFrameworks
            }
        }
    });
    Object.entries(structures).forEach(([structureKey, components]) => {
        components.forEach(component => {
            component.props = findAndReplaceNested(component.props, structures);
            component.props = findAndReplaceNested(component.props, structures);
            component.props = findAndReplaceNested(component.props, structures, true); // At the third recursion, use empty objects
        });
    });
    Object.entries(hydrated).forEach(([componentKey, component]) => {
        component.props = findAndReplaceNested(component.props, structures)

        if (component.props && Object.keys(component.props).length) {
            component.yaml = yaml.dump(component.props, {
                noRefs: true
            });
        }

    });
    return hydrated;
}

const findAndReplaceNested = (obj, structures, limitRecursion) => {
    if (!obj) return obj;
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (typeof obj[i] === "string" && /^bookshop:structure:./.test(obj[i])) {
                const structureKey = obj[i].replace(/^bookshop:structure:|!$/g, '');
                obj[i] = randFrom(structures[structureKey], limitRecursion);
            } else if (typeof obj[i] === "string" && /^bookshop:./.test(obj[i])) {
                const structureKey = `component:${obj[i].replace(/^bookshop:|!$/g, '')}`;
                obj[i] = randFrom(structures[structureKey], limitRecursion);
            } else {
                obj[i] = findAndReplaceNested(obj[i], structures, limitRecursion);
            }
        }
        return obj;
    }
    if (typeof obj === "object") {
        Object.entries(obj).forEach(([key, val]) => {
            if (typeof val === "string" && /^bookshop:structure:./.test(val)) {
                const structureKey = val.replace(/^bookshop:structure:|!$/g, '');
                obj[key] = randFrom(structures[structureKey], limitRecursion);
            } else if (typeof val === "string" && /^bookshop:./.test(val)) {
                const structureKey = `component:${val.replace(/^bookshop:|!$/g, '')}`;
                obj[key] = randFrom(structures[structureKey], limitRecursion);
            } else {
                obj[key] = findAndReplaceNested(obj[key], structures, limitRecursion);
            }
        });
    }
    return obj;
}

const randFrom = (arr, limitRecursion) => (limitRecursion || !arr) ? {} : JSON.parse(JSON.stringify(arr[Math.floor(Math.random() * arr.length)]?.props || {}));

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