import { APITreeItem, SDKSources } from './APITree';
import { ControllerAPI } from '../openapi';

export default class Generator {
  readonly controllers: Record<string, any> = {};

  private treeItems: APITreeItem[] = [];
  private sdkSources: SDKSources = {};

  public constructor(controllers: Record<string, any>) {
    this.controllers = controllers;
  }

  public writeSDKs() {
    Object.entries(this.controllers).forEach(([name, controller]) => {
      if (name.includes('API')) {
        const treeItem = new APITreeItem(controller as ControllerAPI, name);
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
