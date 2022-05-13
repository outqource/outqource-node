const fs = require("fs-extra");
const path = require("path");

const folders = require("./constant").buildFolders;

const buildPath = path.join(__dirname, "../build");
const targetPath = path.join(__dirname, "../");

async function clearBuildFolder() {
  try {
    await fs.remove(buildPath);
    console.log(`Remove Clear Build Folder`);
  } catch (error) {
    console.log("Error! Clear Build Folder");
  }
}

async function clearFolder(folder) {
  try {
    await fs.remove(path.join(targetPath, folder));
    console.log(`Remove Clear Folder | ${folder}`);
  } catch (error) {
    console.log(`Error! Clear Folder | ${folder}`, error);
  }
}

async function clearFolders(folders) {
  await Promise.all(
    folders.map((folder) => {
      return clearFolder(folder);
    })
  );
}

clearBuildFolder().then(() => {
  clearFolders(folders).then();
});
