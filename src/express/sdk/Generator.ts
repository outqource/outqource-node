import * as fs from "fs/promises";
import * as path from "path";

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
        const files = await fs.readdir(this.#root);
        for (const file of files) {
            const filePath = path.join(this.#root, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                await this.#generate(filePath, this.#dest);
            } else {
                const content = await fs.readFile(filePath, "utf8");
                const destPath = path.join(this.#dest, file);
                await fs.writeFile(destPath, content);
            }
        }
    }
}