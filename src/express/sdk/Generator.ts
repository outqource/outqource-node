import APITree from "./APITree";

export default class Generator {
    readonly #root: string;
    readonly #dest: string;

    public constructor(root: string, dest: string) {
        this.#root = root;
        this.#dest = dest;
    }

    public static async generate(root: string, dest: string) {
        const generator = new Generator(root, dest);
        await generator.#generate();
    }

    async #generate() {
        const tree = await APITree.create(this.#root, this.#dest);
        console.log(tree);
    }
}
