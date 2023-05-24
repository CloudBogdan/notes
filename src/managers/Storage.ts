export default class Storage {

    static saveItem(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    static loadItem<T>(key: string): T | null {
        const rawData = localStorage.getItem(key);
        if (!rawData) return null;

        return JSON.parse(rawData) || null;
    }
    static removeItem(key: string) {
        localStorage.removeItem(key);
    }
    static loadItems<T>(containsKey: string): T[] {
        const items: T[] = [];

        for (const key of Object.keys(localStorage)) {
            if (key.includes(containsKey)) {
                const item = this.loadItem<T>(key);
                if (item)
                    items.push(item);
            }
        }

        return items;
    }
}