import APITree from './APITree';
import * as path from 'path';

export default class Generator {
  readonly #root: string;
  readonly #dest: string;

  public constructor(root: string, dest: string) {
    this.#root = root;
    this.#dest = dest;
  }

  public static async generate(root: string, dest: string) {
    const generator = new Generator(path.join(process.cwd(), root), path.join(process.cwd(), dest));
    await generator.#generate();
  }

  async #generate() {
    const tree = await APITree.create('', this.#root);
    await tree.writeFiles(this.#dest, true);
  }
}
