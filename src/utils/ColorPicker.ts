export class ColorPicker {
    store = [
        'bg-lime-700',
        'bg-green-700',
        'bg-emerald-700',
        'bg-teal-700',
        'bg-cyan-700',
        'bg-sky-700',
        'bg-blue-700',
        'bg-indigo-700',
        'bg-violet-700',
        'bg-purple-700',
        'bg-fuchsia-700',
        'bg-pink-700',
        'bg-rose-700',
        'bg-red-700',
        'bg-orange-700',
        'bg-amber-700',
        'bg-yellow-700',
    ];
    cursor = 0;
    constructor() {
        this.store = [...this.store, ...this.store.slice(1, this.store.length - 2).reverse()];
    }
    pick(index?: number) {
        if (typeof index === 'number') {
            index = index % this.store.length;
            this.cursor = index + 1;
            return this.store[index];
        }
        if (this.cursor === this.store.length) {
            this.cursor = 0;
        }
        // console.log(this.cursor);
        return this.store[this.cursor++] + ` color${this.cursor} `;
    }
}
