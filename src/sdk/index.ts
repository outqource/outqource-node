import Generator from './Generator';

if (require.main === module) {
  const root = process.argv[2];
  const dest = process.argv[3];
  if (!root || !dest) {
    console.error('Usage: npx outqource-node <root> <dest>');
    process.exit(1);
  }

  generate(root, dest).then(() => {
    console.log('Done');
  });
}

export default async function generate(root: string, dest: string) {
  return await Generator.generate(root, dest);
}
