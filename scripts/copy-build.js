const fs = require('fs-extra');
const path = require('path');

const folders = require('./constant').buildFolders;

const buildPath = path.join(__dirname, '../build');
const targetPath = path.join(__dirname, '../');

async function copyFolder(folder){
	try{
		await fs.copy(path.join(buildPath, folder), path.join(targetPath, folder));
		console.log(`Copy Folder | ${folder}`);
	}catch(error){
		console.log(`Error! Copy Folder ${folder}`, error);
	}
}

async function copyFolders(folders){
	await Promise.all(
		folders.map((folder) => {
			return copyFolder(folder);
		}
	))
}

copyFolders(folders).then();