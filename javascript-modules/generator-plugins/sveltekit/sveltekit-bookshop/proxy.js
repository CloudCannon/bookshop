export const make_bookshop_proxy = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    if (obj instanceof String) return obj;
    return new Proxy(obj, {
        get(target, name, receiver) {
            let val = Reflect.get(target, name, receiver);
            if (!(name instanceof String || typeof name === "string")) return val;
            let path = name;
            if (target?.__bookshop_path) path = `${target.__bookshop_path}.${path}`;

            if (val && typeof val === "object") {
                Object.defineProperty(val, "__bookshop_path", {
                    enumerable: false,
                    writable: true,
                    value: path
                });
                return make_bookshop_proxy(val);
            } else if (val && name === "_bookshop_name") {
                let bookshopNameObj = new String(val);
                Object.defineProperty(bookshopNameObj, "__bookshop_path", {
                    enumerable: false,
                    writable: true,
                    value: path
                });
                return bookshopNameObj;
            }
            return val;
        },
        set(target, name, value, receiver) {
            return Reflect.set(target, name, value, receiver);
        }
    });
}
