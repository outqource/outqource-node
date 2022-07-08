'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteScheduler = exports.createScheduler = void 0;
const node_schedule_1 = __importDefault(require('node-schedule'));
const createScheduler = props => {
  try {
    node_schedule_1.default.scheduleJob(props.date, async () => {
      try {
        console.log('스케쥴러 실행');
        await props.callback();
      } catch (e) {
        throw { status: 500, message: e };
      }
    });
  } catch (e) {
    throw { status: 500, message: e };
  }
};
exports.createScheduler = createScheduler;
const deleteScheduler = props => {
  return new Promise((resolve, reject) => {
    try {
      resolve(node_schedule_1.default.cancelJob(props.targetId));
    } catch (e) {
      reject(e);
    }
  });
};
exports.deleteScheduler = deleteScheduler;
