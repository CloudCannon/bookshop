const processPropObject = (obj) => {
    for (const key of Object.keys(obj)) {
        if (obj[key]?.select && Array.isArray(obj[key].select)) {
            obj[key] = obj[key].default || obj[key].select[0]
        }
        
        if (obj[key]?.preview && Array.isArray(obj[key].preview)) {
            obj[key] = obj[key].default || obj[key].preview[0]
        }
        
        if (obj[key]?.default) {
            obj[key] = obj[key].default
        }
        
        if (Array.isArray(obj[key])) {
            obj[key].forEach((arr_obj, index) => {
                obj[key][index] = processPropObject(arr_obj);
            })
        } else if (typeof obj[key] === "object") {
            obj[key] = processPropObject(obj[key]);
        }
    }
    return obj;
}

const processBookshopProps = (obj) => {
    if (!obj) return {};
    obj = obj.props ?? {};
    return processPropObject(obj);
}

export default processBookshopProps;