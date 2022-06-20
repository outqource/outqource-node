export default class Generator {
  #private;
  constructor(root: string, dest: string);
  static generate(root: string, dest: string): Promise<Record<string, string>>;
}
