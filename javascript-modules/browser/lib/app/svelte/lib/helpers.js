import toml from '@ltd/j-toml';
import yaml from 'js-yaml';

const processPropObject = (obj) => {
    for (const key of Object.keys(obj)) {
        if (obj[key]?.instance) {
            obj[key] = obj[key].instance
        } else if (obj[key]?.select && Array.isArray(obj[key].select)) {
            obj[key] = obj[key].default || obj[key].select[0]
        } else if (obj[key]?.preview && Array.isArray(obj[key].preview)) {
            obj[key] = obj[key].default || obj[key].preview[0]
        } else if (obj[key]?.default) {
            obj[key] = obj[key].default
        } else if (Array.isArray(obj[key])) {
            obj[key].forEach((arr_obj, index) => {
                obj[key][index] = processPropObject(arr_obj);
            })
        } else if (typeof obj[key] === "object") {
            obj[key] = processPropObject(obj[key]);
        }
    }
    return obj;
}

export const processBookshopProps = (obj) => {
    if (!obj) return {};
    obj = obj.props ?? {};
    return processPropObject(obj);
}

export const getBookshopKey = (path) => {
    let base = path.replace(/^.*components\//, '').split(".")[0];
    let parts = base.split("/");
    const l = parts.length;
    if (l >= 2 && parts[l-1] === parts[l-2]) {
        parts.pop();
        base = parts.join("/");
    }
    return base;
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
        const parsedComponent = toml.parse(component ?? "", 1, "\n", false);
        if (!parsedComponent?.component) return;

        if (exclude?.length) {
            let excludedTags = parsedComponent?.component?.tags?.filter(tag => exclude.indexOf(tag) >= 0);
            if (excludedTags?.length) return;
        }

        const transformedComponentProps = processBookshopProps(parsedComponent);
        const componentKey = getBookshopKey(path);

        let componentYaml = "# No props";
        if (transformedComponentProps && Object.keys(transformedComponentProps).length) {
            componentYaml = yaml.dump(transformedComponentProps, {
                noRefs: true
            });
        }

        const matchedFrameworks = engines.filter(engine => engine.hasComponent(componentKey)).map(engine => engine.key);
        if (matchedFrameworks.length) {
            hydrated[componentKey] = {
                identity: parsedComponent.component,
                props: transformedComponentProps,
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
    return {props, err};
}

export const updateUrl = (component, framework) => {
    const currentURL = new URL(window.location);
    currentURL.hash = `${component}:${framework}`;
    window.history.replaceState({}, "", currentURL);
}