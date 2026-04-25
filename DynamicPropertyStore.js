export class DynamicPropertyStore {
    static #instance;
    properties = new Map();

    static getInstance() {
        if (DynamicPropertyStore.#instance)
            return DynamicPropertyStore.#instance;
        this.properties = new Map();
        DynamicPropertyStore.#instance = new DynamicPropertyStore();
        return DynamicPropertyStore.#instance;
    }

    has(name) {
        return this.properties.has(name);
    }

    get(name) {
        return this.properties.get(name);
    }

    set(name, value) {
        if (value === void 0)
            this.properties.delete(name);
        else if (typeof value === 'object')
            this.properties.set(name, JSON.stringify(value));
        else
            this.properties.set(name, value);
    }

    delete(name) {
        this.properties.delete(name);
    }

    getIds() {
        return [...this.properties.keys()];
    }

    clear() {
        this.properties.clear();
    }
}

export const worldDynamicPropertyStore = DynamicPropertyStore.getInstance();