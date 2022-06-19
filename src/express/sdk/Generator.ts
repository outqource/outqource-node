import APITree from "./APITree";

export default class Generator {
    readonly #root: string;
    readonly #dest: string;

    public constructor(root: string, dest: string) {
        this.#root = root;
        this.#dest = dest;
    }

    public async generate() {
        await this.#generate();
    }

    async #generate() {
        const tree = await APITree.create(this.#root, this.#dest);
        console.log(tree);
    }
}
