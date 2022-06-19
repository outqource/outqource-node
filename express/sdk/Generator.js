'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a setter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot write private member to an object whose class did not declare it');
    return kind === 'a' ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value), value;
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _Generator_instances, _Generator_root, _Generator_dest, _Generator_generate;
Object.defineProperty(exports, '__esModule', { value: true });
const APITree_1 = __importDefault(require('./APITree'));
const path = __importStar(require('path'));
class Generator {
  constructor(root, dest) {
    _Generator_instances.add(this);
    _Generator_root.set(this, void 0);
    _Generator_dest.set(this, void 0);
    __classPrivateFieldSet(this, _Generator_root, root, 'f');
    __classPrivateFieldSet(this, _Generator_dest, dest, 'f');
  }
  static async generate(root, dest) {
    const generator = new Generator(path.join(process.cwd(), root), path.join(process.cwd(), dest));
    await __classPrivateFieldGet(generator, _Generator_instances, 'm', _Generator_generate).call(generator);
  }
}
exports.default = Generator;
(_Generator_root = new WeakMap()),
  (_Generator_dest = new WeakMap()),
  (_Generator_instances = new WeakSet()),
  (_Generator_generate = async function _Generator_generate() {
    const tree = await APITree_1.default.create('', __classPrivateFieldGet(this, _Generator_root, 'f'));
    await tree.writeFiles(__classPrivateFieldGet(this, _Generator_dest, 'f'));
  });
