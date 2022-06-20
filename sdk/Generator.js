'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const APITree_1 = require('./APITree');
class Generator {
  constructor(controllers) {
    this.controllers = {};
    this.treeItems = [];
    this.sdkSources = {};
    this.controllers = controllers;
  }
  writeSDKs() {
    Object.entries(this.controllers).forEach(([name, controller]) => {
      if (name.includes('API')) {
        const treeItem = new APITree_1.APITreeItem(controller, name);
        this.treeItems.push(treeItem);
        this.sdkSources = {
          ...this.sdkSources,
          [treeItem.name]: treeItem.writeFile(),
        };
      }
    });
    return this.sdkSources;
  }
}
exports.default = Generator;
