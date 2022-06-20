import { SDKSources } from './APITree';
export default class Generator {
  readonly controllers: Record<string, any>;
  private treeItems;
  private sdkSources;
  constructor(controllers: Record<string, any>);
  writeSDKs(): SDKSources;
}
