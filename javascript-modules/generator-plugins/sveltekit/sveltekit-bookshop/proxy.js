export const make_bookshop_proxy = (obj) => {
    return new Proxy(obj, {
        get(target, name, receiver) {
            let val = Reflect.get(target, name, receiver);
            let path = name;
            if (target.__bookshop_path) path = `${target.__bookshop_path}.${path}`;

            if (typeof val === "object") {
                Object.defineProperty(val, "__bookshop_path", {
                    enumerable: false,
                    writable: true,
                    value: path
                });
                return make_bookshop_proxy(val);
            }
            return val;
        },
        set(target, name, value, receiver) {
            return Reflect.set(target, name, value, receiver);
        }
    });
}
