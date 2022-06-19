import Generator from "./Generator";

export default function generate(root: string, dest: string) {
  const generator = new Generator(root, dest);
  return generator.generate();
}